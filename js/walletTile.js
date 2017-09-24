class WalletTile extends HTMLElement {
	// Fires when an instance of the element is created.
	createdCallback() {

	};
	// Fires when an instance was inserted into the document.
	attachedCallback() {};
	// Fires when an instance was removed from the document.
	detachedCallback() {};
	// Fires when an attribute was added, removed, or updated.
	attributeChangedCallback(attr, oldVal, newVal) {};
}
document.registerElement('wallet-tile', WalletTile);