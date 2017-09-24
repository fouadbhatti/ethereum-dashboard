class Storage {
	constructor() {}

	static push(name, value, key = 'address') {
		let array = this.get(name, []);
		let isRecordPresent = _.findIndex(array, item => item[key] == value[key]) !== -1;
		if (!isRecordPresent) {
			array.push(value);
			this.set(name, array);
			return 'record added';
		} else {
			array[isRecordPresent] = value;
			this.set(name, array);
			return 'record updated'	;
		}
	}

	static pop(name, value, key = 'address') {
		let array = this.get(name, []);
		let isRecordPresent = _.findIndex(array, item => item[key] == value[key]) !== -1;

		if (isRecordPresent) {
			array.splice(isRecordPresent, 1);
			this.set(name, array);
			return true;
		} else {
			return false;
		}
	}

	static get(name, def) {
		let obj = localStorage[name];

		if (!obj) {
			obj = def;
		}
		else if (obj.startsWith("val:")) {
			// simple value, no need to json parse
			obj = obj.replace("val:", "");
		}
		else {
			obj = JSON.parse(obj);
		}

		return obj;
	}

	static set(name, value) {
		if (typeof value == "object") {
			value = JSON.stringify(value);
		}
		else {
			// add "val:" to the value to indicate that it's not a json value
			value = "val:" + value;
		}

		localStorage[name] = value;
	}
}
