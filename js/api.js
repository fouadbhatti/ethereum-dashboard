class Api {
	static mapEthExplorerRes(name, res) {
		if (!_.property('tokens')(res)) {
			let tokens = [];
			if (res.ETH.balance !== 0) {
				tokens.push({
					symbol:'ETH',
					balance: res.ETH.balance
				});
			}

			return {
				address: res.address,
				tokens,
				name
			};
		}

		let tokens = res.tokens.map((token) => {
			let fixed = Utils.toFixed(token.balance);
			fixed = parseInt(fixed);
			let balance = fixed / (Math.pow(10, token.tokenInfo.decimals));
			return {
				symbol: token.tokenInfo.symbol,
				balance: balance,
			};
		});

		if (res.ETH.balance != 0) {
			tokens.push({
				symbol:'ETH',
				balance: res.ETH.balance
			});
		}

		return {
			address: res.address,
			tokens,
			name
		}
	}

	static mapResponse(name, res) {
		return this.mapEthExplorerRes(name, res);
	}

	static getAddressDetails(name, address) {
		return Utils.request({
			method: 'GET',
			url: `${Config.primary}/${address}?${Config.apiKey}`,
		})
		.map(res => {
			return JSON.parse(res);
		})
		.catch(e => {
			return Rx.Observable.of({
				error: true
			});
		})
		.map(res => {
			if (!!_.property('error')(res)) return res;
			return this.mapResponse(name, res)
		})
	}
}