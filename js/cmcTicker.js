class CmcTicker {
	static getTicker() {
		return Utils.request({
			method: 'GET',
			url: Config.cmcTicker,
		})
		.catch(e => {
			return Rx.Observable.of(null);
		})
	}
}