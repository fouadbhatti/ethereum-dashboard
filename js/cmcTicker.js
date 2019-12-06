class CmcTicker {
	static getTicker() {
		let first100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=1`,
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let second100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=101`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let third100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=201`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let fourth100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=301`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let fifth100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=401`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let sixth100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=501`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let seventh100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=601`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		let eighth100$ = Utils.request({
			method: 'GET',
			url: `${Config.cmcTicker}&start=701`
		})
		.catch(e => {
			return Rx.Observable.of(null);
		});
		
		return Rx.Observable.forkJoin([first100$, second100$, third100$, fourth100$, fifth100$, sixth100$, seventh100$, eighth100$]);
	}
}
