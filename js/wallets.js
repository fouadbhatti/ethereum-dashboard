class Wallets {
	constructor() {
		this.$modal = $('#addAddress');
		this.$save = this.$modal.find('#save');
		this.$walletAddress = this.$modal.find('#walletAddress');
		this.$walletName = this.$modal.find('#walletName');
		this.init();
	}

	init() {
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
			});
	}

	save(wallet) {
		Settings.saveWallet(wallet);
	}

	fetch(address = null) {
		if (address) return Settings.getWallet(address);
		return Settings.getWallets();
	}
}
const wallets = new Wallets();