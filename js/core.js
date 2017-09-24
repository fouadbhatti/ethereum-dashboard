class Core {
	constructor() {
		let addresses = [
			'0x071BADdb846E2E15B17368B29a0fE4248D69570C',
			'0x621fa2565366c5f1359321a104cc35703e7e8e1c',
			'0x22Ab43B28A5Ebf4a8f1B1801BF714cDfffD421c6',
			'0x6e142c391a46826e2a624c3ab8435e5e70f6c26d'
		];

		this.getBalances(addresses);
	}

	mapEthExplorerAddressDetails(res) {
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
				tokens
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
			tokens
		}
	}


	getBalances(addresses) {
		addresses = _.uniq(addresses);

		Rx.Observable.of(addresses)
		.flatMap((_addresses) => {
			// Map addresses array to array of observable requests.
			let fetchBalances$ = _addresses.map((address) => {
				return Utils.request({
					method: 'GET',
					url: `${Config.primary}/${address}?${Config.apiKey}`,
				}).catch(e => {
					const error = {
						addressDetails: e,
						success: false,
					};
					return Rx.Observable.of(error);
				})
				.map(res => {
					// If error do nothing, as we have already mapped data above in error case
					if (_.property('success')(res) === false) return res;
					return {
						addressDetails: this.mapEthExplorerAddressDetails(JSON.parse(res)),
						success: true,
					};
				});
			});

			return Rx.Observable.forkJoin(fetchBalances$);
		})
		.map(wallets => {
			// Drop any failed responses from response array
			return wallets.filter(b => b.success === true);
		})
		// Don't move further if all our requests have been failed
		.filter(wallets => wallets.length > 0)
		// Further clean data structure
		.map(wallets => {
			return wallets.map(item =>  item.addressDetails);
		})
		.subscribe((wallets) => {
			console.log(wallets);
			let x = this.computeSummary(wallets);
			console.log(x);
			this.renderSummaryView(x);
		});
	}


	computeSummary(wallets) {
		// As we are assigning to array thus we need to clone before that operation.
		let _wallets = _.cloneDeep(wallets);
		return _wallets.reduce((totalTokenSummary, wallet, key) => {
			let tokens = wallet.tokens;
			for (let token of tokens) {
					// Find if that token exists, then add baalance to it.
				let tokenIndex = _.findIndex(totalTokenSummary, _token => _token.symbol == token.symbol);
				if (tokenIndex !== -1) {
					totalTokenSummary[tokenIndex].balance = totalTokenSummary[tokenIndex].balance + token.balance;
				} else {
					totalTokenSummary.push(token);
				}
			}
			return totalTokenSummary;
		}, [])
	}

	renderSummaryView(summary) {
		const $summaryBalances = $("#summaryBalances");
		if (summary.length > 0) {
			$summaryBalances.empty();

			for (let token of summary) {
				if (token.balance >= 0.00001) {
					let balance = Utils.roundOff(token.balance);
					let className = `cc ${token.symbol} pr-2`;
					$summaryBalances.append(`<span class="col-sm-2"><i class="${className}"></i>${balance} ${token.symbol}</span>`);
					const icon = $summaryBalances[0].getElementsByClassName(className)[0];

					const psudeo = window.getComputedStyle(icon, ':before').getPropertyValue('content');
					if (!psudeo) {
						$(icon).removeClass(token.symbol).addClass('BTC-alt');
					}
				}
			}
		}
	}

}

const init = new Core();