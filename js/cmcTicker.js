class CmcTicker {
	static getTicker() {
		let first100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=0`,
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let second100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=100`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		return Rx.Observable.forkJoin([first100$, second100$]);
	}
}
