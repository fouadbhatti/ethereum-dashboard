class   Api {
	static mapEthExplorerRes(name, address, res) {
		if (!_.property('tokens')(res)) {
			let tokens = [];
			if (res.ETH.balance !== 0) {
				tokens.push({
					symbol:'ETH',
					balance: res.ETH.balance
				});
			}

			return {
				address,
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
			address,
			tokens,
			name
		}
	}

	static mapResponse(name, address, res) {
		return this.mapEthExplorerRes(name, address, res);
	}

	static getAddressDetails(name, address) {
		let delay = Math.floor(Math.random() * 3001);
		return Rx.Observable.of(null)
		.delay(delay)
		.flatMap(() => {
			return Utils.request({
				method: 'GET',
				url: `${Config.primary}/${address}?${Config.apiKey}`,
			})
			// .map(res => {
			// 	return JSON.parse(res);
			// })
			.catch(e => {
				return Rx.Observable.of({
					error: true,
					name,
					address
				});
			})
			.map(res => {
				if (!!_.property('error')(res)) {
					res.name = name;
					res.address = address;
					return res;
				}
				return this.mapResponse(name, address, res)
			});
		});
	}
}