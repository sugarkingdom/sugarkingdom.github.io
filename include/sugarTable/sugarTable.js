/**
 * 表格组件
 * Required:
 * 		jQuery 1.12.4
 * 		bootstrap 3.3.7
 * 		(option) accounting
 * 		(option) bootstrap select 1.12.2
 * 		(option) fancybox 3.2.1
 */
(function ($, window, undefined) {

	$.fn.sugarTable = function (methodOrOptions) {
		if (methods[methodOrOptions]) {
			return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
			methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + methodOrOptions + ' does not exist on sugarTable');
		}
	};

	// 表格默认参数
	$.fn.sugarTable.defaults = {
		table: { // 表参数
			list: [], // 列表数据源
			length: 0, // 生成列表行数
			count: 0, // 列表计数
			isLocal: false, // 是否需要本地分页
			pageDom: $("#page"), // 分页DOM
			page: 1, // 页数
			pageSet: 1, // 分页组件页码个数
			pageSize: 10, // 每页数量
			fields: [], // 列表列名称
			seriText: "序号", // 序号显示文本
			tableClass: "table table-bordered table-hover", // 列表样式
			noSeri: false, // 是否需要序号列
			noPaging: false, // 是否需要分页
			noCheckbox: false, // 是否需要勾选框
			multiCheck: false, // 是否为多选模式
			noHideBtn: false, // 是否隐藏按钮
			needSum: false, // 是否需要额外统计行
			sumBaseGroup: [], // 统计基于的字段集合
			sumCalcGroup: [], // 统计计算的字段集合
			needFinalSum: false, // 是否需要额外总计行
			finalSumCalcGroup: [], // 总计计算的字段集合
			checkHandler: function name(data) {
				console.info("sugarTable checked!");
			},
			searchHandler: function name(data) {
				console.info("sugarTable searched!");
			},
			rowGenHandler: function name(data) {
				console.info("sugarTable row generated!");
			},
			tableGenHandler: function name(data) {
				console.info("sugarTable table generated!");
			},
		},
		field: { // 域参数
			text: { // 域类型-文本
				id: "", // 域ID
				type: "", // 域类型
				name: "", // 域列名
				isMoney: false, // 是否需要金额处理
				moneyMultiplier: 1, // 金额默认缩放倍数
				moneySymbol: "$", // 金额显示单位
				moneyDecimal: ".", // 金额小数位分隔符
				moneyThousand: ",", // 金额千位分隔符
				moneyPrecision: 2, // 金额小数位数
				moneyFormat: "%s%v", // 金额格式
				isDate: false, // 是否需要日期处理
				dateFormat: "yyyy年MM月dd日 hh:mm:ss", // 日期格式
				isStatus: false, // 是否需要状态处理
				pairs: {}, // 状态键值对
				fontWeight: "normal",
				color: "unset",
				display: "table-cell",
			},
			object: { // 域类型-对象
				id: "",
				type: "",
				name: "",
				key: "", // 对象键ID
			},
			input: { // 域类型-输入框
				id: "",
				type: "",
				name: "",
				isNumber: false, // 是否需要纯数字处理
				decimalLength: 0,
				allowMinus: false,
				intLength: 5,
			},
			select: { // 域类型-选择框
				id: "",
				type: "",
				name: "",
				optionType: "",
				optionId: "",
				optionSplit: "",
				changeHandler: function name(data) {
					console.info("Welcome to Sugar Kingdom!");
				},
			},
			textarea: { // 域类型-文本框
				id: "",
				type: "",
				name: "",
				row: 5,
				readonly: false,
			},
			modal: { // 域类型-弹出框
				id: "",
				type: "",
				name: "",
			},
			icon: {
				id: "",
				type: "",
				name: "",
				preset: "",
				sexId: "",
				sexOrder: [],
				hoverImage: "",
				prePath: "",
				imagePath: "",
			},
			mix: {
				id: "",
				type: "",
				name: "",
				content: [],
			},
		}
	};

	/**
	 * 获取域的值（仅内部使用）
	 * @param  {DOM}  el
	 * @return {String or Object}  域的值
	 */
	function _getValue(el) {
		switch (el.attributes.sugartype.value) {
			case 'text':
				return el.innerText;
			case 'object':
				var object = {};
				object[el.attributes.sugarkey.value] = el.innerText;
				return object;
			case 'input':
				return el.value;
			case 'select':
				return el.value;
				// return $(el).selectpicker('val');
			case 'textarea':
				return el.value;
			case "modal": //// TODO
				return '';
			default:
				return undefined;
		}
	}

	/**
	 * 生成表格域（仅内部使用）
	 * @param  {String} type  域类型
	 * @param  {Object} opts  参数
	 *                  opts.id	表格ID
	 *                  opts.index	数据行数
	 *                  opts.listData	表格数据
	 *                  opts.fieldData	域格式
	 * @return {String or Object}  域内容
	 */
	function _genField(type, opts) {
		var _temp = {};
		_temp.id = opts.id;
		_temp.index = opts.index;
		_temp.listData = opts.listData;
		_temp.fieldData = opts.fieldData;

		switch (type) {

			case 'text': // 文本

				if (typeof _temp.fieldData.isMoney !== "undefined" && _temp.fieldData.isMoney && typeof _temp.listData[_temp.fieldData.id] !== 'undefined') { // 金额展示处理
					_temp.fieldData.moneyMultiplier = _temp.fieldData.moneyMultiplier || 1;
					_temp.text = accounting.formatMoney(_temp.listData[_temp.fieldData.id] * _temp.fieldData.moneyMultiplier, {
						symbol: _temp.fieldData.moneySymbol || "$",
						decimal: _temp.fieldData.moneyDecimal || ".",
						thousand: _temp.fieldData.moneyThousand || ",",
						precision: _temp.fieldData.moneyPrecision || 2,
						format: _temp.fieldData.moneyFormat || "%s%v"
					});
				} else if (typeof _temp.fieldData.isDate !== "undefined" && _temp.fieldData.isDate && typeof _temp.listData[_temp.fieldData.id] !== 'undefined') { // 日期展示处理
					_temp.text = (new Date(parseInt(_temp.listData[_temp.fieldData.id]))).Format(_temp.fieldData.format);
				} else if (typeof _temp.fieldData.isStatus !== "undefined" && _temp.fieldData.isStatus && typeof _temp.listData[_temp.fieldData.id] !== 'undefined') { // 状态展示处理
					_temp.text = _temp.fieldData.pairs[_temp.listData[_temp.fieldData.id]];
				} else {
					_temp.text = _temp.listData[_temp.fieldData.id] || '';
				}
				return _temp.text;

			case 'object': // 对象

				// 将对象里的值提出
				_temp.object = _temp.listData[_temp.fieldData.id] || {};
				opts.listData[_temp.fieldData.id] = _temp.object[_temp.fieldData.key];

				// 赋值逻辑与文本域相同
				return _genField('text', opts);

			case 'input': // 输入框

				_temp.input = $('<input>').addClass('form-control').attr({
					// id: _temp.id + '_input_' + _temp.index + '_' + _temp.fieldData.id,
					type: 'text',
					sugarline: _temp.index,
					sugarid: _temp.fieldData.id,
					sugartype: 'input',
					name: 'sugar_' + _temp.fieldData.id, // 用于校验
					placeholder: '请输入' + _temp.fieldData.name
				});

				// 纯数字输入处理
				if (typeof _temp.fieldData.isNumber !== "undefined" && _temp.fieldData.isNumber) {
					_toNumberInput(_temp.input, {
						decimalLength: _temp.fieldData.decimalLength || 0,
						allowMinus: _temp.fieldData.allowMinus || false,
						intLength: _temp.fieldData.intLength || 5
					});
				}

				// 赋值逻辑与文本域相同
				_temp.input.val(_genField('text', opts));
				return _temp.input;

			case 'select': // 选择框

				_temp.select = $('<select>').addClass('form-control').attr({
					// id: _temp.id + '_select_' + _temp.index + '_' + _temp.fieldData.id,
					sugarline: _temp.index,
					sugarid: _temp.fieldData.id,
					sugartype: 'select',
					title: '请选择' + _temp.fieldData.name
				});
				switch (_temp.fieldData.optionType) {
					case 'text':
						_temp.o_list = _temp.listData[_temp.fieldData.optionId].split(_temp.fieldData.optionSplit);
						break;
					case 'array':
						_temp.o_list = _temp.listData[_temp.fieldData.optionId];
						break;
					case 'list':
						break;
					default:
						break;
				}
				if (_temp.o_list.length > 0) {
					_temp.options = [];
					_temp.options.push($('<option>').attr({
						selected: '',
						value: ''
					}));
					for (var k = 0; k < _temp.o_list.length; k++) {
						_temp.options.push($('<option>').attr({
							value: _temp.o_list[k]
						}).text(_temp.o_list[k]));
					}
					_temp.select.append(_temp.options);
				}
				_temp.select.val(_temp.listData[_temp.fieldData.id] || "");

				// 处理change事件，传递当前行数与change后值
				if (typeof _temp.fieldData.changeHandler !== 'undefined') {
					_temp.select.on('change', function (event) {
						event.preventDefault();
						this.data = {
							lineNum: $(this).attr("sugarline"),
							value: $(this).val(),
						};
						_temp.fieldData.changeHandler.call(this, this.data);
					});
				}
				return _temp.select;

			case 'textarea': // 文本框

				_temp.textarea = $("<textarea>").addClass("from-control").attr({
					// id: id + '_textarea_' + index + '_' + fieldData.id,
					rows: _temp.fieldData.row || 5,
					sugarline: _temp.index,
					sugarid: _temp.fieldData.id,
					sugartype: 'textarea',
					readonly: _temp.fieldData.readonly || false,
				});

				// 赋值逻辑与文本域相同
				_temp.textarea.val(_genField('text', opts));
				return _temp.textarea;

			case "modal": // 弹出框 //// TODO

				// tdTemp1 = $("<td>");
				// divTemp1 = $("<div>").addClass('input-group');
				// inputTemp1 = $("<input type='text'>").addClass('form-control').attr({
				// 	id: opts.id + '_input_' + i + '_' + tField.showValue,
				// 	placeholder: '请选择' + tField.name,
				// 	readonly: true
				// }).val((tData[tField.showValue] || ''));
				// divTemp2 = $("<div>").addClass('input-group-addon btn btn-xs btn-danger ' + tField.clearBtnClass).attr({
				// 	id: tField.clearBtnId + '_' + i,
				// 	alt: i,
				// 	style: ((typeof tData[tField.id] !== 'undefined') ? '' : 'display: none;') + ' border-left: 0;',
				// 	'data-toggle': 'tooltip',
				// 	'data-placement': 'left',
				// 	title: '清空' + tField.name
				// }).append($("<i>").addClass('fa fa-fw fa-times'));
				// divTemp2.tooltip();
				// divTemp3 = $("<div>").addClass('input-group-addon btn btn-xs btn-primary ' + tField.selectBtnClass).attr({
				// 	alt: i,
				// 	title: '选择' + tField.name
				// }).append($("<i>").addClass('fa fa-fw fa-search'));
				// divTemp1.append(inputTemp1).append(divTemp2).append(divTemp3);
				// tdTemp1.append(divTemp1);
				// tr.append(tdTemp1);
				return '';

			case 'icon': // 图标

				_temp.icon = $('<i>').append('&nbsp;');
				switch (_temp.fieldData.preset) {
					case "sex": // 预置模板-性别
						if (_temp.listData[_temp.fieldData.sexId] == _temp.fieldData.sexOrder[0]) {
							_temp.icon.addClass('ico_male');
						} else if (_temp.listData[_temp.fieldData.sexId] == _temp.fieldData.sexOrder[1]) {
							_temp.icon.addClass('ico_female');
						} else if (_temp.listData[_temp.fieldData.sexId] == _temp.fieldData.sexOrder[2]) {
							_temp.icon.addClass('ico_question');
						}
						if (typeof _temp.fieldData.hoverImage !== "undefined") {
							_temp.icon.addClass('sugar-hoverpic').attr({
								href: (_temp.fieldData.prePath || '') + _temp.listData[_temp.fieldData.hoverImage],
								'data-fancybox': 'images'
							});
						}
						break;
					case "pic": // 预置模板-图片
						_temp.icon.addClass('fa fa-fw fa-picture-o');
						if (typeof _temp.fieldData.imagePath !== "undefined") {
							_temp.icon.addClass('sugar-hoverpic').attr({
								href: (_temp.fieldData.prePath || '') + _temp.listData[_temp.fieldData.imagePath],
								'data-fancybox': 'images'
							});
						}
						break;
					default:
						break;
				}
				return _temp.icon;

			case 'mix': // 混合

				_temp.content = [];
				for (var contentIndex = 0; contentIndex < _temp.fieldData.content.length; contentIndex++) {
					var contentData = _temp.fieldData.content[contentIndex];
					_temp.content.push(_genField(contentData.type, {
						id: _temp.id,
						index: _temp.index,
						listData: _temp.listData,
						fieldData: contentData,
					}));
				}
				return _temp.content;

			default:
				return '';
		}
	}

	/**
	 * 数字输入限制（仅内部使用）
	 * 已知问题：右键菜单粘贴无效
	 *
	 * @param textbox	DOM
	 * @param opts	选项：
	 * 			decimalLength	小数点后位数，默认为0
	 * 			allowMinus		允许负数，默认为false
	 * 			intLength		小数点前位数，默认为5
	 */
	function _toNumberInput(textbox, opts) {
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

	var methods = {

		/**
		 * 初始化组件
		 * @param  {Object} options 参数
		 * @return
		 */
		init: function (options) {
			var _table = {};

			// 表格元素ID
			_table.id = this[0].id;

			// 构造参数
			_table.o = $.extend({}, $.fn.sugarTable.defaults.table, options || {});

			// 表头元素
			_table.thead = $('<thead>');

			// 表格内容元素
			_table.tbody = $('<tbody>');

			// 表格css
			if (typeof this[0] !== "undefined") {
				this[0].className = _table.o.tableClass + ' sugar-table';
			}

			// 清空表格
			this.empty();

			// 生成表头
			_table.theadTr = $("<tr>");

			// 构造勾选框
			if (!_table.o.noCheckbox) {
				_table.theadTr.append($("<th>"));
			}

			// 构造表头序号列
			if (!_table.o.noSeri) {
				_table.theadTr.append($("<th>").addClass('seri').html(_table.o.seriText));
			}

			// 构造表头
			for (_table.fieldIndex = 0; _table.fieldIndex < _table.o.fields.length; _table.fieldIndex++) {
				_table.fieldData = _table.o.fields[_table.fieldIndex];
				_table.theadTr.append($("<th>").css({
					width: _table.fieldData.width || 'auto',
					display: _table.fieldData.hide ? 'none' : 'table-cell'
				}).html(_table.fieldData.name));
			}

			// 装入表头元素
			_table.thead.append(_table.theadTr);

			// 如果需要本地分页，处理列表数据
			if (_table.o.isLocal) {
				_table.o.list = _table.o.list.slice((_table.o.page - 1) * _table.o.pageSize, _table.o.page * _table.o.pageSize);
			}

			// 如果需要统计或总计，处理列表数据
			if (_table.o.needSum || _table.o.needFinalSum) {
				if (_table.o.needSum) { // 需要额外统计行
					// 用于统计比较的字段
					_table.sumBaseStrA = "";
					_table.sumBaseStrB = "";

					// 统计后数据
					_table.afterSumList = [];

					// 统计行数据
					_table.sumData = {};

					// 统计行数据
					_table.finalSumData = {};
				}

				for (_table.listIndex = 0; _table.listIndex < _table.o.list.length; _table.listIndex++) {
					_table.listData = _table.o.list[_table.listIndex];

					// 构造原始行号
					_table.listData.sugarSeri = (_table.o.page - 1) * _table.o.pageSize + parseInt(_table.listIndex) + 1;

					if (_table.o.needSum) { // 需要额外统计行

						// 拼装统计比较字段
						_table.sumBaseStrB = "";
						for (_table.baseIndex = 0; _table.baseIndex < _table.o.sumBaseGroup.length; _table.baseIndex++) {
							_table.baseData = _table.o.sumBaseGroup[_table.baseIndex];
							if (_table.baseData.type === 'text') { // 文本
								_table.sumBaseStrB += _table.listData[_table.baseData.id];
							} else if (_table.baseData.type === 'object') { // 对象
								_table.sumBaseStrB += _table.listData[_table.baseData.id][_table.baseData.key];
							}
						}

						// 如果比较字段不相符且不为首行，则添加统计结果到列表数据，并清空统计结果
						if (_table.sumBaseStrA !== _table.sumBaseStrB && _table.sumBaseStrA !== "") {

							// 添加统计数据行号
							_table.sumData.sugarSeri = "合计";
							_table.afterSumList.push(_table.sumData);
							_table.sumData = {};
						}

						// 重置比较字段
						_table.sumBaseStrA = _table.sumBaseStrB;

						// 记录统计计算字段
						for (_table.calcIndex = 0; _table.calcIndex < _table.o.sumCalcGroup.length; _table.calcIndex++) {
							_table.calcData = _table.o.sumCalcGroup[_table.calcIndex];
							if (_table.calcData.type === 'text') { // 文本
								_table.sumData[_table.calcData.id] = _table.sumData[_table.calcData.id] || 0;
								_table.sumData[_table.calcData.id] =
									$.fn.sugarAddFloats(_table.sumData[_table.calcData.id],
										parseFloat(_table.listData[_table.calcData.id]));
							} else if (_table.calcData.type === 'object') { // 对象
								_table.sumData[_table.calcData.id] = _table.sumData[_table.calcData.id] || {};
								_table.sumData[_table.calcData.id][_table.calcData.key] = _table.sumData[_table.calcData.id][_table.calcData.key] || 0;
								_table.sumData[_table.calcData.id][_table.calcData.key] =
									$.fn.sugarAddFloats(_table.sumData[_table.calcData.id][_table.calcData.key],
										parseFloat(_table.listData[_table.calcData.id][_table.calcData.key]));
							}
						}

						// 保存当前行数据
						_table.afterSumList.push(_table.listData);
					}

					if (_table.o.needFinalSum) { // 需要额外总计行

						// 记录总计计算字段
						for (_table.calcIndex = 0; _table.calcIndex < _table.o.finalSumCalcGroup.length; _table.calcIndex++) {
							_table.calcData = _table.o.finalSumCalcGroup[_table.calcIndex];
							if (_table.calcData.type === 'text') { // 文本
								_table.finalSumData[_table.calcData.id] = _table.finalSumData[_table.calcData.id] || 0;
								_table.finalSumData[_table.calcData.id] =
									$.fn.sugarAddFloats(_table.finalSumData[_table.calcData.id],
										parseFloat(_table.listData[_table.calcData.id]));
							} else if (_table.calcData.type === 'object') { // 对象
								_table.finalSumData[_table.calcData.id] = _table.finalSumData[_table.calcData.id] || {};
								_table.finalSumData[_table.calcData.id][_table.calcData.key] = _table.finalSumData[_table.calcData.id][_table.calcData.key] || 0;
								_table.finalSumData[_table.calcData.id][_table.calcData.key] =
									$.fn.sugarAddFloats(_table.finalSumData[_table.calcData.id][_table.calcData.key],
										parseFloat(_table.listData[_table.calcData.id][_table.calcData.key]));
							}
						}
					}
				}

				if (_table.o.needSum) { // 需要额外统计行

					// 如果末行统计结果不为空，则添加统计结果到列表数据
					if (_table.sumData !== {}) {

						// 添加统计数据行号
						_table.sumData.sugarSeri = "合计";
						_table.afterSumList.push(_table.sumData);
						_table.sumData = {};
					}
				}

				if (_table.o.needFinalSum) { // 需要额外总计行

					// 如果末行总计结果不为空，则添加总计结果到列表数据
					if (_table.finalSumData !== {}) {

						// 添加统计数据行号
						_table.finalSumData.sugarSeri = "总计";
						_table.afterSumList.push(_table.finalSumData);
						_table.finalSumData = {};
					}
				}

				// 替换列表数据
				_table.o.list = _table.afterSumList;
			}

			// 生成列表数据
			_table.trArr = [];
			for (_table.listIndex = 0; _table.listIndex < _table.o.list.length; _table.listIndex++) {
				_table.listData = _table.o.list[_table.listIndex];
				var _list = {};
				_list.tr = $("<tr>");

				// 构造勾选框
				if (!_table.o.noCheckbox) {
					_list.inputCheckbox = $("<input type='checkbox'>").attr({
						// id: _table.id + "_checkbox_" + _table.listIndex,
						class: "styled styled-primary",
						sugarid: _table.listIndex,
						sugarline: _table.listIndex,
						sugartype: 'line_checkbox',
					});
					_list.labelCheckbox = $("<label>").attr("for", _table.id + "_checkbox_" + _table.listIndex);
					_list.divCheckbox = $("<div>").addClass("checkbox checkbox-primary").append(_list.inputCheckbox).append(_list.labelCheckbox);
					_list.tdCheckbox = $("<td>").addClass('sugar-checkbox').append(_list.divCheckbox);
					_list.tr.append(_list.tdCheckbox);
				}

				// 构造序号列（如果存在统计生成的序列，则使用）
				if (!_table.o.noSeri) {
					_table.listData.sugarSeri = _table.listData.sugarSeri || ((_table.o.page - 1) * _table.o.pageSize + parseInt(_table.listIndex) + 1);
					_list.tdSeri = $("<td>").addClass('seri').html(_table.listData.sugarSeri);
					_list.tr.append(_list.tdSeri);
				}

				// 生成单行数据
				for (_table.fieldIndex = 0; _table.fieldIndex < _table.o.fields.length; _table.fieldIndex++) {
					_table.fieldData = _table.o.fields[_table.fieldIndex];
					switch (_table.fieldData.type) {
						case "text": // 文本
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_text_' + _table.fieldData.id,
								sugarline: _table.listIndex,
								sugarid: _table.fieldData.id,
								sugartype: 'text',
							});

							// 处理样式
							_list.td.css({
								fontWeight: _table.fieldData.bold ? 'bold' : 'normal',
								color: _table.fieldData.colors ? _table.fieldData.colors[_table.listData[_table.fieldData.id]] : 'unset',
								display: _table.fieldData.display ? 'none' : 'table-cell'
							});
							_list.td.append(_genField('text', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "object": // 对象
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_object_' + _table.fieldData.id + '_' + _table.fieldData.key,
								sugarline: _table.listIndex,
								sugarid: _table.fieldData.id,
								sugarkey: _table.fieldData.key,
								sugartype: 'object',
							});
							_list.td.append(_genField('object', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "input": // 输入框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_input_' + _table.fieldData.id,
							});
							_list.td.append(_genField('input', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "select": // 选择框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_select_' + _table.fieldData.id,
							});
							_list.td.append(_genField('select', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "textarea": // 文本输入框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_textarea_' + _table.fieldData.id,
							}).addClass('sugar-textarea');
							_list.td.append(_genField('textarea', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "modal": // 弹出框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_modal_' + _table.fieldData.id,
							});
							_list.td.append(_genField('modal', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "mix": // 混合
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + _table.listIndex + '_mix_' + _table.fieldData.id,
							});
							_list.td.append(_genField('mix', {
								id: _table.id,
								index: _table.listIndex,
								listData: _table.listData,
								fieldData: _table.fieldData
							}));
							_list.tr.append(_list.td);
							break;
						default:
							break;
					}
				}

				// 生成列表的每列时的额外处理
				if (typeof _table.o.rowGenHandler !== "undefined") {
					_table.o.rowGenHandler.call(this, _table.listData);
				}
				_table.trArr.push(_list.tr);
			}

			// 组装表格
			_table.tbody.append(_table.trArr);
			this.append(_table.thead).append(_table.tbody);

			// 渲染选择组件
			// if ($('[sugartype=select]').length > 0) {
			// 	$('[sugartype=select]').selectpicker({
			// 		container: 'body'
			// 	});
			// }

			// 渲染图标组件
			$(".sugar-hoverpic").hover(function () {
				if ($(".sugar-hoverpicbox").length == 0) {
					$("body").append($("<div>").addClass('sugar-hoverpicbox dropdown-menu'));
				}
				$(".sugar-hoverpicbox").css("left", $(this).offset().left - 50);
				$(".sugar-hoverpicbox").css("top", $(this).offset().top - 100);
				$(".sugar-hoverpicbox").html('<img src="' + $.trim($(this).attr('href')) + '" />');
				$(".sugar-hoverpicbox").stop(true, true).fadeIn(200);
			}, function () {
				$(".sugar-hoverpicbox").stop(true, true).fadeOut(200);
			});
			$(".sugar-hoverpic").mousemove(function (e) {
				var Y = $(this).parent().offset().top;
				var X = $(this).parent().offset().left;
				$(".sugar-hoverpicbox").css({
					top: (e.pageY + 10) + "px",
					left: (e.pageX + 10) + "px"
				});
			});

			// 渲染图片组件
			// $('[data-fancybox="images"]').fancybox();

			// 查询完成后隐藏左侧按钮
			if (!_table.o.noHideBtn) {
				$(".btn-begin-hide").hide();
				$(".btn-begin-hide").attr({
					alt: '',
					href: '#'
				});
			}

			// 构造分页组件
			if (!_table.o.noPaging) {
				_table.o.pageDom.sugarPage({
					page: _table.o.page,
					pageSet: _table.o.pageSet,
					count: _table.o.count,
					totalPage: (_table.o.count / _table.o.pageSize) || 1,
					onPage: function (event) {
						page = event.data.page;

						// 查询完成后隐藏左侧按钮
						if (!_table.o.noHideBtn) {
							$(".btn-begin-hide").hide();
							$(".btn-begin-hide").attr({
								alt: '',
								href: '#'
							});
						}
						_table.o.searchHandler.call(this, page);
					}
				});
			}

			// 处理选中事件
			if (!_table.o.noCheckbox) {
				var _tbody_first = _table.tbody[0];
				var _tbody_rows = _table.tbody.find("tr");

				var currentCheckboxHandler = function () {
					this.checked = !this.checked;
				};
				var currentRowHandler = function () {
					var currentCheckbox = $(this).find("input")[0] || {};
					var currentCheckState = currentCheckbox.checked || false;

					// 如果为单选模式，则清空所有checkbox
					if (!_table.o.multiCheck) {
						var checkboxes = _table.tbody.find("input[sugartype=line_checkbox]");
						for (var checkboxIndex = 0; checkboxIndex < checkboxes.length; checkboxIndex++) {
							checkboxes[checkboxIndex].checked = false;
						}
						// 清空所有行样式
						for (var rowIndex = 0; rowIndex < _tbody_rows.length; rowIndex++) {
							_tbody_first.rows[rowIndex].className = "";
						}
					}

					if (!currentCheckState) {
						currentCheckbox.checked = true;
						this.className = "info";
						if (typeof _table.o.checkHandler !== "undefined") {
							_table.o.checkHandler.call(this, currentCheckbox.attributes.sugarline.value);
						}
					} else {

						// 隐藏左侧按钮
						$(".btn-begin-hide").hide();
						$(".btn-begin-hide").attr({
							alt: '',
							href: '#'
						});

						// 如果为多选模式，则清空当前 checkbox 与当前行样式
						if (_table.o.multiCheck) {
							currentCheckbox.checked = false;
							this.className = "";
						}
					}
				};
				for (var i = 0; i < _tbody_rows.length; i++) {
					var currentRow = _tbody_first.rows[i];
					var currentCheckbox = $(currentRow).find("input")[0] || {};

					// 点击checkbox区域时，对checkbox反向处理，以便在rowClick中统一操作
					currentCheckbox.onclick = currentCheckboxHandler;

					currentRow.onclick = currentRowHandler;
				}
			}

			// 生成列表后的额外处理
			if (typeof _table.o.tableGenHandler !== "undefined") {
				_table.o.tableGenHandler.call(this);
			}

			// 保存参数到全局变量
			$.fn.sugarTable.options = $.fn.sugarTable.options || {};
			$.fn.sugarTable.options[_table.id] = options;
		},

		/**
		 * 获取整个表格内所有域的值
		 * @return {Array} 包含各列键值对的数组，结构：
		 *         [0:{name1:value1_1,name2:value1_2},1:{name1:value2_1,name2:value2_2}]
		 */
		getValues: function () {
			var values = [];
			var value = {};
			var lineNum = $.fn.sugarTable.options[this.attr('id')].count;

			var getFieldValue = function (index, el) {
				value[el.attributes.sugarid.value] = _getValue(el);
			};

			for (var i = 0; i < lineNum; i++) {
				value = {};
				this.find('[sugartype!=line_checkbox][sugarline=' + i + ']').each(getFieldValue.bind());
				values.push(value);
			}
			return values;
		},

		/**
		 * 获取整个表格内指定域的值
		 * @param  {Object} opts 附加参数
		 *                       id 		指定域的ID
		 *                       lineNum  	指定表格行数，从1开始
		 * @return {Array} 包含各列键值对的数组，结构：
		 *         [0:{name1:value1_1,name2:value1_2},1:{name1:value2_1,name2:value2_2}]
		 * @return {String} 如果只有一个匹配域，则返回该域的值
		 */
		getValue: function (opts) {
			opts = opts || {};
			var findStr = '[sugartype!=line_checkbox]';
			if (typeof opts.id !== "undefined") {
				findStr += '[sugarid=' + opts.id + ']';
			}
			if (typeof opts.lineNum !== "undefined") {
				findStr += '[sugarline=' + (opts.lineNum - 1) + ']';
			}
			if (this.find(findStr).length > 1) {
				var values = [];
				var value = {};
				var tempValue = '';
				var lineNum = $.fn.sugarTable.options[this.attr('id')].count;

				var getFieldValue = function (index, el) {
					if (typeof opts.id !== "undefined" && el.attributes.sugarid.value !== opts.id) {
						return;
					} else if (typeof opts.lineNum !== "undefined" && i !== (opts.lineNum - 1)) {
						return;
					} else {
						tempValue = _getValue(el);
						if (typeof tempValue !== "undefined") {
							value[el.attributes.sugarid.value] = _getValue(el);
						}
					}
				};

				for (var i = 0; i < lineNum; i++) {
					value = {};
					this.find('[sugartype!=line_checkbox][sugarline=' + i + ']').each(getFieldValue.bind());
					values.push(value);
				}
				return values;
			} else if (this.find(findStr).length === 1) {
				return _getValue(this.find(findStr)[0]);
			} else {
				return "";
			}
		},

		/**
		 * 获取整个表格内选中行的值
		 * @param  {Object} opts 附加参数
		 *                       id 		指定域的ID
		 * @return {Array} 包含各列键值对的对象，结构：
		 *         {line_num_1:{name1:value1_1,name2:value1_2},line_num_2:{name1:value2_1,name2:value2_2}}
		 */
		getSelectedRows: function (opts) {
			opts = opts || {};
			var findStr = '[sugartype]';
			if (typeof opts.id !== "undefined") {
				findStr += '[sugarid=' + opts.id + ']';
			}
			if (this.find('[sugartype=line_checkbox]:checked').length >= 1) {
				var values = {};
				var value = {};
				var tempValue = '';
				var $this = this;
				var getFieldValue = function (index, el) {
					if (typeof opts.id !== "undefined" && el.attributes.sugarid.value !== opts.id) {
						return;
					} else {
						tempValue = _getValue(el);
						if (typeof tempValue !== "undefined") {
							value[el.attributes.sugarid.value] = tempValue;
						}
					}
				};
				var getCheckedRows = function (index, el) {
					value = {};
					$this.find('[sugartype][sugarline=' + el.attributes.sugarline.value + ']').each(getFieldValue.bind());
					values[el.attributes.sugarline.value] = value;
				};
				this.find('[sugartype=line_checkbox]:checked').each(getCheckedRows.bind());
				return values;
			} else {
				return "";
			}
		},
	};


	/**
	 * 分页组件
	 * @param  {Object} options 参数
	 * @return
	 */
	$.fn.sugarPage = function (options) {
		if (!this.length) {
			return;
		}
		var defaultOptions = $.data(this[0], 'pageOptions');
		if (!defaultOptions) {
			defaultOptions = {
				page: 0,
				pageSet: 1,
				totalPage: 1
			};
		}
		options = $.extend(defaultOptions, options);
		$.data(this[0], 'pageOptions', options);

		var page = Math.ceil(parseFloat(options.page));
		var set = Math.ceil(parseFloat(options.pageSet));
		var total = Math.ceil(parseFloat(options.totalPage));
		var count = Math.ceil(parseFloat(options.count));
		var hasEvent = typeof (options.onPage) == "function";

		var $ul = $('<ul class="pagination"></ul>');
		var $li;
		// var $pagesize = $('<input type="text">')
		var $span = $('<span class="pageinfo"></span>');
		this.empty();
		this.append($ul);
		// this.append($pagesize);
		this.append($span);
		$span.text("第 " + page + " 页，共 " + total + " 页， " + count + " 条记录");
		if (total > 0) {
			// var $first = $('<li><a href="javascript:;"><i class="fa fa-step-backward"></i></a></li>');
			var $pre = $('<li><a href="javascript:;"><i class="fa fa-backward"></i></a></li>');
			var i;
			if (page <= 0) {
				page = 1;
			}
			if (page > total) {
				page = total; // 当前页数变更需要通知组件onPage
				// $first.on("click", {
				// 	page: page
				// }, options.onPage);
			}
			if (page > 1) {
				$ul.append($pre);
				if (hasEvent) {
					// $first.on("click", {
					// 	page: 1
					// }, options.onPage);
					$pre.on("click", {
						page: page - 1
					}, options.onPage);
				}
			} else {
				// $ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-step-backward"></a></li>');
				$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-backward"></i></a></li>');
			}
			if (page - set > 2) {
				$li = $('<li><a href="javascript:;">1</a></li>');
				$ul.append($li);
				if (hasEvent) {
					$li.on("click", {
						page: 1
					}, options.onPage);
				}
				for (i = page - set; i < page; i++) {
					$li = $('<li><a href="javascript:;">' + i + '</a></li>');
					$ul.append($li);
					if (hasEvent) {
						$li.on("click", {
							page: i
						}, options.onPage);
					}
				}
			} else {
				for (i = 1; i < page; i++) {
					$li = $('<li><a href="javascript:;">' + i + '</a></li>');
					$ul.append($li);
					if (hasEvent) {
						$li.on("click", {
							page: i
						}, options.onPage);
					}
				}
			}
			$ul.append('<li class="active"><a href="javascript:;">' + page + '</a></li>');

			if (page + set < total - 1) {
				for (i = page + 1; i <= (page + set); i++) {
					$li = $('<li><a href="javascript:;">' + i + '</a></li>');
					$ul.append($li);
					if (hasEvent) {
						$li.on("click", {
							page: i
						}, options.onPage);
					}
				}
				$li = $('<li><a href="javascript:;">' + total + '</a></li>');
				$ul.append($li);
				if (hasEvent) {
					$li.on("click", {
						page: total
					}, options.onPage);
				}
			} else {
				for (i = page + 1; i <= total; i++) {
					$li = $('<li><a href="javascript:;">' + i + '</a></li>');
					$ul.append($li);
					if (hasEvent) {
						$li.on("click", {
							page: i
						}, options.onPage);
					}
				}
			}

			if (page < total) {
				var $next = $('<li><a href="javascript:;"><i class="fa fa-forward"></i></a></li>');
				// var $last = $('<li><a href="javascript:;"><i class="fa fa-step-forward"></i></a></li>');
				$ul.append($next);
				if (hasEvent) {
					// $last.on("click", {
					// 	page: total
					// }, options.onPage);
					$next.on("click", {
						page: page + 1
					}, options.onPage);
				}
			} else {
				$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-forward"></i></a></li>');
				// $ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-step-forward"></i></a></li>');
			}
			if (parseInt(options.page) > total) {
				this.on("click", {
					page: page
				}, options.onPage);
				this.trigger("click");
				this.unbind("on");
			}
		} else {
			$ul.append('<li class="active"><a href="javascript:;">1</a></li>');
		}
	};


	/**
	 * 浮点数相加
	 * @param {float} f1
	 * @param {float} f2
	 */
	$.fn.sugarAddFloats = function (f1, f2) {
		//Helper function to find the number of decimal places
		function findDec(f1) {
			function isInt(n) {
				return typeof n === 'number' &&
					parseFloat(n) == parseInt(n, 10) && !isNaN(n);
			}
			var a = Math.abs(f1);
			f1 = a;
			var count = 1;
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
	};

	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	// 例子：
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	Date.prototype.Format = function (fmt) { // author: meizz
		var o = {
			"M+": this.getMonth() + 1, // 月份
			"d+": this.getDate(), // 日
			"h+": this.getHours(), // 小时
			"m+": this.getMinutes(), // 分
			"s+": this.getSeconds(), // 秒
			"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
			"S": this.getMilliseconds()
			// 毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	};
})(jQuery, window);