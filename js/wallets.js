class MyWallets {
	constructor() {
		this.$modal = $('#addAddress');
		this.$save = this.$modal.find('#save');
		this.$walletAddress = this.$modal.find('#walletAddress');
		this.$walletName = this.$modal.find('#walletName');
	}

	getTokens(_wallets) {
		_wallets = _.uniq(_wallets, 'address');

		return Rx.Observable.of(_wallets)
				.filter(wallets => wallets.length >0)
				.flatMap((wallets) => {
					let queryAddressDetails$ = wallets.map((wallet, index) => {
						return Api.getAddressDetails(wallet.name, wallet.address, index);
					});
					return Rx.Observable.forkJoin(queryAddressDetails$);
				})
				// .map(wallets => {
				// 	// Drop any failed responses from response array
				// 	return wallets.filter(b => !_.property('error')(b));
				// })
					// Don't move further if all our requests have been failed
				.filter(wallets => {
					return wallets.length > 0;
				})
				.flatMap((wallets) => {

					let $wallets = Rx.Observable.of(wallets);
					let $cmcTicker = CmcTicker.getTicker();
					return Rx.Observable.zip($wallets, $cmcTicker, (wallets, ticker) => {
						ticker = ticker.reduce((a, b.data) => {
							return [...a, ...b];
						}, []);
						return wallets.map(wallet => {
								if (wallet && wallet.tokens) {
									let tokens =  wallet.tokens.map(token => {
										let details = ticker.find(item => item.symbol.toUpperCase() === token.symbol.toUpperCase());
										return {
											...token,
											details
										};
									});

									return {
										...wallet,
										tokens
									}
								}
							return wallet;
						});
					})
				});
	}

	onWalletEdit() {
		this.$editWallet = $('.edit-wallet');

		Rx.Observable.fromEvent(this.$editWallet, 'click')
		.map(e => {
			let address = $(e.target).closest('.card').find('.address-id').text();
			return address;
		})
		.subscribe(address => {
			let details = this.fetch(address);
			this.$walletName.val(details.name);
			this.$walletAddress.val(details.address);
			this.$modal.modal('show');
		});
	}

	onWalletSaved(cbk) {
		Rx.Observable.fromEvent(this.$save[0], 'click')
			.map(() => {
				let name = this.$walletName.val().trim();
				let address = this.$walletAddress.val().trim();
				return {
					name,
					address
				}
			})
			.filter(item => {
				return !!item.address;
			})
			.subscribe(wallet => {
				this.save(wallet);
				this.$modal.modal('hide');
				this.clearFormInputs();
				cbk();
			});
	}

	clearFormInputs() {
		this.$walletName.val('');
		this.$walletAddress.val('')
	}

	save(wallet) {
		 Settings.saveWallet(wallet);
	}

	fetch(address = null) {
		if (address) return Settings.getWallet(address);
		return Settings.getWallets();
	}
}
const myWallets = new MyWallets();
