class Utils {
	static request(request) {
		let $ajax = $.ajax(request).promise();
		return Rx.Observable.fromPromise($ajax);
	}

	static toFixed(x) {
		if (Math.abs(x) < 1.0) {
			let e = parseInt(x.toString().split('e-')[1]);
			if (e) {
				x *= Math.pow(10,e-1);
				x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
			}
		} else {
			let e = parseInt(x.toString().split('+')[1]);
			if (e > 20) {
				e -= 20;
				x /= Math.pow(10,e);
				x += (new Array(e+1)).join('0');
			}
		}
		return x;
	}

	static roundOff(num, relaxed = false) {
		num = parseFloat(num);

		const numAbs = Math.abs(num);

		if (relaxed && numAbs >= 100) {
			num = num.toFixed(0);
		}
		else if (numAbs >= 1) {
			num = num.toFixed(2)
		}
		else if (numAbs >= 0.1) {
			num = num.toFixed(4)
		}
		else if (numAbs >= 0.00001) {
			num = num.toFixed(5)
		}
		else {
			num = 0;
		}

		return num;
	}
}