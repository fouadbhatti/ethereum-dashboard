class Core {
	constructor() {
		this.$infoHeader = $('#info-header');
		this.$noWallet = $('#no-wallets-empty');
		this.$summaryBalances = $('#summaryBalances');
		this.$walletDetails = $('#wallet-details');

		myWallets.onWalletSaved(() => {
			this.renderView();
		});

		this.renderView();

		CmcTicker.getTicker()
			.subscribe(x => {
				console.log(x);
		});
	}

	clearState() {
		this.$summaryBalances.empty();
		this.$walletDetails.empty();
	}

	renderView() {
		let wallets = myWallets.fetch();
		if (wallets.length === 0) {
			this.noWallets();
			return;
		}
		this.getTokensAndRender(wallets);
	}

	registerRemoveWallet() {
		this.$removeWallet = $('.remove-wallet');

		Rx.Observable.fromEvent(this.$removeWallet, 'click')
		.map(e => {
			let address = $(e.target).closest('.card').find('.address-id').text();
			return address;
		})
		.subscribe(address => {
			let removed = Settings.removeWallet(address);
			this.renderView();
		});
	}

	noWallets() {
		this.clearState();
		this.$noWallet.show();
		this.$infoHeader.html(`This is a free, open-source, client-side interface for Ethereum wallet dashboard that shows, 
			in depth balance and summary of all your added wallets, without the hassle of opening every wallet and seeing balances.<br><br> <b>To get started just add your public wallet addresses.</b>`)
	}

	getTokensAndRender(wallets) {
		this.$infoHeader.text('Tokens Summary');
		this.$noWallet.hide();
		this.$summaryBalances.empty().html(`<span class="col-sm-12">Loading Blockchain....</span>`).show();

		myWallets.getTokens(wallets)
			.subscribe((list) => {
				let summary = this.computeSummary(list);
				this.renderSummaryView(summary);
				this.renderWalletDetails(list);
				this.registerRemoveWallet();
				myWallets.onWalletEdit();
			});
	}

	computeSummary(list) {
		// As we are changing inside wallets array thus need to cloneDeep.
		let wallets = _.cloneDeep(list);
		wallets = wallets.filter(b => !_.property('error')(b));

		return wallets.reduce((totalTokenSummary, wallet) => {
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

	renderTokens(tokens) {
		//<i class="align-middle pr-2 cc ${token.symbol}"></i>
		return `
			${tokens.map(token => `<span class="col-sm-4 col-6 mt-4">
                          <div class="text-center token-label">${token.symbol}</div>
                           <div class="mt-1 text-center">${Utils.roundOff(token.balance, true)}</div>
                        </span>`
		).join('')}`;
	}

	renderWalletDetails(_list) {
		let list = _.cloneDeep(_list);
		let filteredList = list.filter(b => !_.property('error')(b));
		let errorList = list.filter(b => !!_.property('error')(b));

		this.$walletDetails.empty();

		if (filteredList.length > 0) {
			let details = `
			${filteredList.map(item => `
				<div class="col-lg-4 mt-5 pr-2 pl-2">
					<div class="card">
            <div class="card-body">
            	<div>
	              <h5 class="card-title mt-0" style="display: inline;">${item.name}</h5>
	              <button type="button" class="close remove-wallet" aria-label="Close">
								  <span aria-hidden="true">&times;</span>
								</button>
								<button type="button" class="close edit-wallet mr-1" aria-label="Edit">
								  <span aria-hidden="true" style="font-size: 19px;">&#9998;</span>
								</button>
							</div>
               <h7 class="card-subtitle mb-2 text-muted address-id">${item.address}</h7>
                <div class="row balances">
									${this.renderTokens(item.tokens)}
                 </div>
            </div>
          </div>
      	</div>
			`).join('')}
		`;
			this.$walletDetails.append(details);
		}

		if (errorList.length > 0) {
			let errorDetails = `
			${errorList.map(item => `
				<div class="col-lg-4 mt-5 pr-2 pl-2">
					<div class="card">
            <div class="card-body">
            	<div>
	              <h5 class="card-title mt-0" style="display: inline;">${item.name}</h5>
	              <button type="button" class="close remove-wallet" aria-label="Close">
								  <span aria-hidden="true">&times;</span>
								</button>
								<button type="button" class="close edit-wallet mr-1" aria-label="Edit">
								  <span aria-hidden="true" style="font-size: 19px;">&#9998;</span>
								</button>
							</div>
							<h7 class="card-subtitle mb-2 text-muted address-id">${item.address}</h7>
							<div class="row balances">
								<div class="col-sm-12 mt-4 text-center text-danger">
                   ${item.error.message}
                </div>
               </div>
            </div>
          </div>
      	</div>
			`).join('')}
		`;
			this.$walletDetails.append(errorDetails);
		}
	}

	sortByPriceTotal(list) {
		let unsorted = list.map((item) => {
			if (!!item.details) {
				let balance = Utils.roundOff(item.balance, true);
				let priceUsd = item.details.quote.USD.price
				if (priceUsd) {
					item.totalValue = (parseFloat(priceUsd) * balance);
				} else {
					item.totalValue = 0;
				}
			} else {
				item.totalValue = 0;
			}
			return item;
		});

		return _.sortBy(unsorted, ['totalValue']).reverse();
	}

	renderSummaryView(_summary) {
		let summary = this.sortByPriceTotal(_summary);
		const $summaryBalances = this.$summaryBalances;
		$summaryBalances.empty();
		if (summary.length > 0) {
			for (let token of summary) {
				if (token.balance >= 0.00001) {
					let balance = Utils.roundOff(token.balance, true);
					if (!!token.details) {
						let logoUrl = `${Config.cmcIcons}${token.details.name}.png`;
						let priceUsd = token.details.quote.USD.price
						let percentageChange = token.details.quote.USD.percent_change_24h;
						let color = percentageChange ? percentageChange.indexOf('-') >= 0 ? 'text-danger': 'text-success' : '';

						let total = "";
						if (priceUsd) {
							total = (parseFloat(priceUsd) * balance);
							total = Utils.nFormatter(total);
						}

						$summaryBalances.append(`
							<span class="col-sm-4 col-lg-3 col-xl-2 col-6 mt-4">
								<img src="${logoUrl}" class="crypo-logo">
								<div>$${total}</div>
								<div>${balance} ${token.symbol}</div>
								<div class="details"><span class="text-primary">$${priceUsd}</span>&nbsp;<span class="${color}">${percentageChange || 'NA'}%</span></div>
							</span>`);
					} else {
						// Legacy handling
						let className = `cc ${token.symbol} pr-2`;
						$summaryBalances.append(`<span class="col-sm-4 col-lg-3 col-xl-2 col-6 mt-4"><i class="${className}"></i>${balance} ${token.symbol}</span>`);
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



}

const init = new Core();
