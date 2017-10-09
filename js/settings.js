class Settings {
	constructor() {}

	static getWallets() {
		return Storage.get('erc-20-wallets', []);
	}

	static getWallet(address) {
		let wallets = this.getWallets();
		return _.find(wallets, item => item.address == address);
	}

	static saveWallet({ name, address }) {
		return Storage.push('erc-20-wallets', {
			name,
			address
		});
	}

	static removeWallet(address) {
		Storage.pop('erc-20-wallets', { address });
	}
}