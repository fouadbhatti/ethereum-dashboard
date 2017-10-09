class WalletTile extends HTMLElement {
	constructor() {
		super();
	}
	// Fires when an instance of the element is created.
	createdCallback() {
		this.innerHTML = `
		                <div class="card">
                        <div class="card-body">
                            <h4 class="card-title mt-0">ETH</h4>
                            <h6 class="card-subtitle mb-2 text-muted">0x5aAAdA56EC670b94388880D86C9C520e94E39c67</h6>
                            <div class="row balances" style="">
                                <span class="col-sm-4 col-6 mt-4">
                                    <div class="text-center"><i class="align-middle pr-2 cc OMG"></i>OMG</div>
                                    <div class="mt-1 text-center">2.38</div>
                                </span>
                                <span class="col-sm-4 col-6 mt-4">
                                    <div class="text-center"><i class="align-middle pr-2 cc ETH"></i>ETH</div>
                                    <div class="mt-1 text-center">0.07002</div>
                                </span>
                                <span class="col-sm-4 col-6 mt-4">
                                    <div class="text-center"><i class="align-middle pr-2 cc BTC"></i>LINK</div>
                                    <div class="mt-1 text-center">1389.20</div>
                                </span>
                                <span class="col-sm-4 col-6 mt-4">
                                    <div class="text-center"><i class="align-middle pr-2 cc BTC"></i>AVT</div>
                                    <div class="mt-1 text-center">22.38</div>
                                </span>
                                <span class="col-sm-4 col-6 mt-4">
                                    <div class="text-center"><i class="align-middle pr-2 cc BTC"></i>AVT</div>
                                    <div class="mt-1 text-center">22.38</div>
                                </span>
                            </div>
                        </div>
                    </div>
		`;
	};
	// Fires when an instance was inserted into the document.
	attachedCallback() {};
	// Fires when an instance was removed from the document.
	detachedCallback() {};
	// Fires when an attribute was added, removed, or updated.
	attributeChangedCallback(attr, oldVal, newVal) {};
}
document.registerElement('wallet-tile', WalletTile);