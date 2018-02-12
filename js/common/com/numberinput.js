/**
 * 数字输入限制
 * 已知问题：右键菜单粘贴无效
 *
 * @param textbox	DOM
 * @param opts	选项：
 * 			decimalLength	小数点后位数，默认为0
 * 			allowMinus		允许负数，默认为false
 * 			intLength		小数点前位数，默认为5
 */
function toNumberInput(textbox, opts) {
	opts = $.extend(true, {
		decimalLength: 0,
		allowMinus: false,
		intLength: 5
	}, opts);
	// called when key is pressed
	// in keydown, we get the keyCode
	// in keyup, we get the input.value (including the charactor we've just typed
	textbox.on("keydown", function _OnNumericInputKeyDown(e) {
		var key = e.which || e.keyCode; // http://keycode.info/

		if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// alphabet
			key >= 65 && key <= 90 ||
			// spacebar
			key == 32) {
			e.preventDefault();
			return false;
		}

		if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// numbers
			// key >= 48 && key <= 57 ||
			// Numeric keypad
			// key >= 96 && key <= 105 ||

			// allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// allow: Ctrl+C
			(key == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(key == 88 && e.ctrlKey === true) ||

			// allow: home, end, left, right
			(key >= 35 && key <= 39) ||
			// Backspace and Tab and Enter
			key == 8 || key == 9 || key == 13 ||
			// Del and Ins
			key == 46 || key == 45) {
			return true;
		}

		var v = this.value; // v can be null, in case textbox is number and does not valid

		if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// numbers
			key >= 48 && key <= 57 ||
			// Numeric keypad
			key >= 96 && key <= 105) {
			if (parseInt(v).toString().length > opts.intLength - 1 && v.slice(-1) != '.') {
				return false;
			}
		}

		// if minus, dash
		if (key == 109 || key == 189) {
			if (!opts.allowMinus) {
				return false;
			}
			// if already has -, ignore the new one
			if (v[0] === '-') {
				// console.log('return, already has - in the beginning');
				return false;
			}
		}

		if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// comma, period and numpad.dot
			key == 190 || key == 188 || key == 110) {
			if (opts.decimalLength === 0) {
				return false;
			}
			// console.log('already having comma, period, dot', key);
			if (/[\.]/.test(v)) {
				// console.log('return, already has . somewhere');
				return false;
			}
		}
	});

	textbox.on("keyup", function _OnNumericInputKeyUp(e) {
		var key = e.which || e.keyCode; // http://keycode.info/

		if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// alphabet
			key >= 65 && key <= 90 ||
			// spacebar
			key == 32) {
			e.preventDefault();
			return false;
		}

		if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
			// numbers
			// key >= 48 && key <= 57 ||
			// Numeric keypad
			// key >= 96 && key <= 105 ||

			// allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// allow: Ctrl+C
			(key == 67 && e.ctrlKey === true) ||
			// Allow: Ctrl+X
			(key == 88 && e.ctrlKey === true) ||

			// allow: home, end, left, right
			(key >= 35 && key <= 39) ||
			// Backspace and Tab and Enter
			key == 8 || key == 9 || key == 13 ||
			// Del and Ins
			key == 46 || key == 45) {
			return true;
		}

		var v = this.value;
		// if minus, dash
		if (key == 109 || key == 189) {
			if (!opts.allowMinus) {
				return false;
			}
			// if already has -, ignore the new one
			if (v[0] === '-') {
				// console.log('return, already has - in the beginning');
				return false;
			}
		}

		if (v) {
			// this replace also remove the -, we add it again if needed
			if (opts.decimalLength === 0) {
				v = (v[0] === '-' ? '-' : '') + v.replace(/[^0-9]/g, '');
			} else {
				v = (v[0] === '-' ? '-' : '') + v.replace(/[^0-9\.]/g, '');
				if (v !== '.' &&
					v.split('.')[1].length > opts.decimalLength) {
					v = parseFloat(v).toFixed(opts.decimalLength);
				}
			}

			// remove all decimalSeparator that have other decimalSeparator following. After this processing, only the last decimalSeparator is kept.
			// v = v.replace(/\.(?=(.*)\.)+/g, '');

			//console.log(this.value, v);
			this.value = v; // update value only if we changed it
		}
	});
}

// 浮点数相加
Math.addFloats = function(f1, f2) {
	//Helper function to find the number of decimal places
	function findDec(f1) {
		function isInt(n) {
			return typeof n === 'number' &&
				parseFloat(n) == parseInt(n, 10) && !isNaN(n);
		}
		var a = Math.abs(f1);
		f1 = a, count = 1;
		while (!isInt(f1) && isFinite(f1)) {
			f1 = a * Math.pow(10, count++);
		}
		return count - 1;
	}
	//Determine the greatest number of decimal places
	var dec1 = findDec(f1);
	var dec2 = findDec(f2);
	var fixed = dec1 > dec2 ? dec1 : dec2;

	//do the math then do a toFixed, could do a toPrecision also
	var n = (f1 + f2).toFixed(fixed);
	return +n;
}