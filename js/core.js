class Core {
	constructor() {
		this.$infoHeader = $('#info-header');
		this.$noWallet = $('#no-wallets-empty');
		this.$summaryBalances = $('#summaryBalances');

		myWallets.onWalletSaved(() => {
			let wallets = myWallets.fetch();
			this.getTokensAndRender(wallets);
		});

		let wallets = myWallets.fetch();

		if (wallets.length === 0) {
			this.noWallets();
			return;
		}

		this.getTokensAndRender(wallets);
	}

	noWallets() {
		this.$noWallet.show();
		this.$infoHeader.html(`This is a Free, open-source, client-side interface for Ethereum wallet dashboard that shows, 
			in depth balance and summary of your all your Ethereum & ERC-20 tokens.<br> <b>To get started just add all your Ethereum wallet public keys and see the magic.</b>`)
	}

	getTokensAndRender(wallets) {
		this.$infoHeader.text('ERC20 Tokens Summary');
		this.$noWallet.hide();
		this.$summaryBalances.empty().text(`Loading Blockchain.....`).show();

		myWallets.getTokens(wallets)
			.subscribe((list) => {
				console.log(list);
				let summary = this.computeSummary(list);
				this.renderSummaryView(summary);
				console.log(summary)
			});
	}

	computeSummary(list) {
		// As we are changing inside wallets array thus need to cloneDeep.
		let wallets = _.cloneDeep(list);

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

	renderWalletDetails

	renderSummaryView(summary) {
		const $summaryBalances = this.$summaryBalances;
		$summaryBalances.empty();
		if (summary.length > 0) {
			for (let token of summary) {
				if (token.balance >= 0.00001) {
					let balance = Utils.roundOff(token.balance);
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

const init = new Core();