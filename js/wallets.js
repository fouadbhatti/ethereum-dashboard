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
					let queryAddressDetails$ = wallets.map((wallet) => {
						return Api.getAddressDetails(wallet.name, wallet.address);
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