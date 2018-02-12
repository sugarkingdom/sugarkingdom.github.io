(function($, window, undefined) {

	$.fn.sugarTable = function(methodOrOptions) {
		if (methods[methodOrOptions]) {
			return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
			methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + methodOrOptions + ' does not exist on sugarTable');
		}
	};

	$.fn.sugarTable.defaults = {
		data: [], // 列表数据源
		length: 0, // 生成列表行数
		count: 0, // 列表计数
		pageDom: $("#page"), // 分页DOM
		page: 1, // 页数
		pageSize: 10, // 每页数量
		fields: [], // 列表列名称
		seriText: "序号", // 序号显示文本
		tableClass: "table table-bordered table-hover", // 列表样式
		noPaging: false, // 是否需要分页
		noCheckbox: false, // 是否需要勾选框
		noHideBtn: false, // 是否隐藏按钮
		needSum: false, // 是否需要额外统计行
		needFinalSum: false, // 是否需要额外总计行
	};

	function take() {

	};

	var methods = {
		init: function(options) {
			var _table = {};

			// 表格元素ID
			_table.id = this[0].id;

			// 构造参数
			_table.o = $.extend({}, $.fn.sugarTable.defaults, options || {});

			// 表头元素
			_table.thead = $('<thead>');

			// 表格内容元素
			_table.tbody = $('<tbody>');

			// 表格css
			if (typeof this[0] !== "undefined") {
				this[0].className = _table.o.tableClass;
			}

			// 清空表格
			this.empty();

			// 生成表头
			_table.theadTr = $("<tr>");

			// 构造勾选框
			if (!_table.o.noCheckbox) {
				_table.theadTr.append($("<th>").append($("<span>").addClass('sr-only').text("勾选框")));
			}

			// 构造表头序号列
			_table.theadTr.append($("<th>").attr('style', 'width:40px;').html(_table.o.seriText));

			// 构造表头
			$.each(_table.o.fields, function(index, field) {
				_table.theadTr.append($("<th>").html(field.name));
			});

			// 装入表头元素
			_table.thead.append(_table.theadTr);

			// 生成列表数据
			_table.trArr = [];
			$.each(_table.o.data, function(listIndex, listData) {
				var _list = {};
				_list.tr = $("<tr>");

				// 构造勾选框
				if (!_table.o.noCheckbox) {
					_list.inputCheckbox = $("<input type='checkbox'>").attr({
						alt: listIndex,
						name: "td_checkbox",
						class: "styled styled-primary",
						id: _table.id + "_checkbox_" + listIndex,
					});
					_list.labelCheckbox = $("<label>").attr("for", _table.id + "_checkbox_" + listIndex);
					_list.divCheckbox = $("<div>").addClass("checkbox abc-checkbox abc-checkbox-primary td-checkbox").append(_list.inputCheckbox).append(_list.labelCheckbox);
					_list.tdCheckbox = $("<td>").css({
						"text-align": "center",
						"width": "40px",
						"padding-left": "32px"
					}).append(_list.divCheckbox);
					_list.tr.append(_list.tdCheckbox);
				}

				// 构造序号列
				_list.seri = (_table.o.page - 1) * _table.o.pageSize + parseInt(listIndex) + 1;
				_list.tdSeri = $("<td>").html(_list.seri);
				_list.tr.append(_list.tdSeri);

				/**
				 * 构造表格域-文本
				 * @param  {Object} opts 参数
				 * @return {String}      表格内文本
				 */
				_list.genField_text = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

					_temp.text = _temp.listData[_temp.fieldData.id] || '';
					if (typeof _temp.fieldData.isMoney !== "undefined" && _temp.fieldData.isMoney) {
						_temp.text = accounting.formatMoney(_temp.listData[_temp.fieldData.id] || '');
					}
					return _temp.text;
				};

				// 构造表格域-对象
				_list.genField_obj = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

					_temp.obj = _temp.listData[_temp.fieldData.id] || {};
					_temp.text = _temp.obj[_temp.fieldData.key] || '';
					if (typeof _temp.fieldData.isMoney !== "undefined" && _temp.fieldData.isMoney) {
						_temp.text = accounting.formatMoney(_temp.obj[_temp.fieldData.key] || '');
					} else {
						_temp.text = _temp.obj[_temp.fieldData.key] || '';
					}
					return _temp.text;
				};

				// 构造表格域-输入框
				_list.genField_input = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

					_temp.input = $("<input type='text'>").addClass('form-control').attr({
						id: _temp.id + '_input_' + _temp.index + '_' + _temp.fieldData.id,
						sugarline: _temp.index,
						sugarid: _temp.fieldData.id,
						sugartype: 'input',
						name: 'sugar_' + _temp.fieldData.id,
						placeholder: '请输入' + _temp.fieldData.name
					});
					if (typeof _temp.fieldData.isNumber !== "undefined" && _temp.fieldData.isNumber) {
						toNumberInput(_temp.input, {
							decimalLength: _temp.fieldData.decimalLength || 0,
							allowMinus: _temp.fieldData.allowMinus || false,
							intLength: _temp.fieldData.intLength || 5
						});
					}
					_temp.input.val(_list.genField_text(opts));
					return _temp.input;
				};

				// 构造表格域-选择框
				_list.genField_select = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

					_temp.select = $('<select>').addClass('form-control').attr({
						id: _temp.id + '_select_' + _temp.index + '_' + _temp.fieldData.id,
						sugarline: _temp.index,
						sugarid: _temp.fieldData.id,
						sugartype: 'select',
						name: 'sugar_' + _temp.fieldData.id,
						title: '请选择' + _temp.fieldData.name
					});
					if (_temp.fieldData.optionType === "text") {
						_temp.o_list = _temp.listData[_temp.fieldData.optionId].split(_temp.fieldData.optionSplit);
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

					_temp.select.on('change', function(event) {
						event.preventDefault();
						this.data = {
							lineNum: $(this).attr("sugarline"),
							value: $(this).val(),
						};
						fieldData.changeHandler.call(this, this.data);
					});
					return _temp.select;
				};

				// 构造表格域-文本框
				_list.genField_textarea = function(index, id, listData, fieldData) {
					this.td = $("<td>").css({
						"padding": 0
					});
					this.textarea = $("<textarea>").addClass("from-control").attr({
						id: id + '_textarea_' + index + '_' + fieldData.id,
						rows: 5
					}).css({
						"width": "100%",
						"resize": "none",
						"padding": "8px",
						"border": "none",
						"background-color": "inherit"
					}).val(listData[fieldData.id]);
					if (typeof fieldData.readonly !== "undefined")
						this.textarea.attr("readonly", true);
					this.td.append(this.textarea);
					return this.td;
				};

				// 构造表格域-弹出框
				_list.genField_modal = function(index, id, listData, fieldData) {
					this.td = $("<td>");
					this.div1 = $("<div>").addClass('input-group');
					this.input = $("<input type='text'>").addClass('form-control').attr({
						id: id + '_input_' + index + '_' + fieldData.showValue,
						placeholder: '请选择' + fieldData.name,
						readonly: true
					}).val((listData[fieldData.showValue] || ''));
					this.div2 = $("<div>").addClass('input-group-addon btn btn-xs btn-danger ' + fieldData.clearBtnClass).attr({
						id: fieldData.clearBtnId + '_' + index,
						alt: index,
						style: ((typeof listData[fieldData.id] !== 'undefined') ? '' : 'display: none;') + ' border-left: 0;',
						'data-toggle': 'tooltip',
						'data-placement': 'left',
						title: '清空' + fieldData.name
					}).append($("<i>").addClass('fa fa-fw fa-times'));
					// this.div2.tooltip();
					this.div3 = $("<div>").addClass('input-group-addon btn btn-xs btn-primary ' + fieldData.selectBtnClass).attr({
						alt: index,
						title: '选择' + fieldData.name
					}).append($("<i>").addClass('fa fa-fw fa-search'));
					this.div1.append(this.input).append(this.div2).append(this.div3);
					this.td.append(this.div1);
					return this.td;
				};

				// 构造表格域-混合-文本
				_list.genField_mix_text = function(index, id, listData, contentData) {
					if (typeof contentData.isMoney !== "undefined" && contentData.isMoney) {
						return accounting.formatMoney(listData[contentData.id] || '');
					} else {
						return listData[contentData.id] || '';
					}
				};

				// 构造表格域-混合-图标
				_list.genField_mix_icon = function(index, id, listData, contentData) {
					if (typeof tFieldContent.preset !== "undefined") {
						switch (tFieldContent.preset) {
							case "sex": // 预置模板-性别
								if (tData[tFieldContent.sexId] == tFieldContent.sexOrder[0]) {
									iTemp1 = $("<i>").addClass('ico_male');
								} else if (tData[tFieldContent.sexId] == tFieldContent.sexOrder[1]) {
									iTemp1 = $("<i>").addClass('ico_female');
								} else if (tData[tFieldContent.sexId] == tFieldContent.sexOrder[2]) {
									iTemp1 = $("<i>").addClass('ico_question');
								}
								if (typeof tFieldContent.hoverImage !== "undefined") {
									iTemp1.addClass('hoverpic').attr('data-pic', tData[tFieldContent.hoverImage]);
								}
								break;
							case "pic": // 预置模板-图片
								iTemp1 = $("<i>").addClass('fa fa-fw fa-picture-o');
								if (typeof tFieldContent.uploadImage !== "undefined") {
									iTemp1.addClass('hoverpic').attr('data-pic', P.uploadImgPath + tData[tFieldContent.uploadImage]);
								}
								break;
							default:
								break;
						}
					}
					if (typeof tFieldContent.hoverImage !== "undefined") {
						iTemp1.addClass('hoverpic').attr('data-pic', tData[tFieldContent.hoverImage]);
					}
					tdTemp1.append(iTemp1).append("&nbsp;");
				};

				// 生成表格域-混合
				_list.genField_mix = function(index, id, listData, fieldData) {
					var self = this;
					this.td = $("<td>");
					$.each(fieldData.content, function(contentIndex, contentData) {
						switch (tFieldContent.type) {
							case "text": // 文本
								self.td.append(_list.genField_mix_text(contentIndex, _table.id, listData, contentData));
								break;
							case "icon": // 图标
								self.td.append(_list.genField_mix_icon(contentIndex, _table.id, listData, contentData));
								break;
							default:
								break;
						}
					});
					for (var k in fieldData.content) {
						tFieldContent = fieldData.content[k];
						switch (tFieldContent.type) {
							case "text": // 文本
								if (typeof tFieldContent.isMoney !== "undefined" && tFieldContent.isMoney) {
									tdTemp1.append(accounting.formatMoney(tData[tFieldContent.id] || ''));
								} else {
									tdTemp1.append(tData[tFieldContent.id] || '');
								}
								break;
							case "icon": // 图标
								if (typeof tFieldContent.preset !== "undefined") {
									switch (tFieldContent.preset) {
										case "sex": // 预置模板-性别
											if (tData[tFieldContent.sexId] == tFieldContent.sexOrder[0]) {
												iTemp1 = $("<i>").addClass('ico_male');
											} else if (tData[tFieldContent.sexId] == tFieldContent.sexOrder[1]) {
												iTemp1 = $("<i>").addClass('ico_female');
											} else if (tData[tFieldContent.sexId] == tFieldContent.sexOrder[2]) {
												iTemp1 = $("<i>").addClass('ico_question');
											}
											if (typeof tFieldContent.hoverImage !== "undefined") {
												iTemp1.addClass('hoverpic').attr('data-pic', tData[tFieldContent.hoverImage]);
											}
											break;
										case "pic": // 预置模板-图片
											iTemp1 = $("<i>").addClass('fa fa-fw fa-picture-o');
											if (typeof tFieldContent.uploadImage !== "undefined") {
												iTemp1.addClass('hoverpic').attr('data-pic', P.uploadImgPath + tData[tFieldContent.uploadImage]);
											}
											break;
										default:
											break;
									}
								}
								if (typeof tFieldContent.hoverImage !== "undefined") {
									iTemp1.addClass('hoverpic').attr('data-pic', tData[tFieldContent.hoverImage]);
								}
								tdTemp1.append(iTemp1).append("&nbsp;");
								break;
							default:
								break;
						}
					}
					return this.td;
				};

				// 生成单行数据
				$.each(_table.o.fields, function(fieldIndex, fieldData) {
					switch (fieldData.type) {
						case "text": // 文本
							_list.td = $("<td>").attr({
								id: _table.id + '_' + listIndex + '_text_' + fieldData.id,
							});
							_list.td.append(_list.genField_text({
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "obj": // 对象
							_list.td = $("<td>").attr({
								id: _table.id + '_' + listIndex + '_obj_' + fieldData.id,
							});
							_list.td.append(_list.genField_obj({
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "input": // 输入框
							_list.td = $("<td>").attr({
								id: _table.id + '_' + listIndex + '_input_' + fieldData.id,
							});
							_list.td.append(_list.genField_input({
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "select": // 选择框
							_list.td = $("<td>").attr({
								id: _table.id + '_' + listIndex + '_select_' + fieldData.id,
							});
							_list.td.append(_list.genField_select({
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "textarea": // 文本输入框
							_list.tr.append(_list.genField_textarea(listIndex, _table.id, listData, fieldData));
							break;
						case "modal": // 弹出框
							_list.tr.append(_list.genField_modal(listIndex, _table.id, listData, fieldData));
							break;
						case "mix": // 混合
							_list.tr.append(_list.genField_mix(listIndex, _table.id, listData, fieldData));
							break;
						default:
							break;
					}
					_table.trArr.push(_list.tr);
				});
			});

			// 组装表格
			_table.tbody.append(_table.trArr);
			this.append(_table.thead).append(_table.tbody);

			// 渲染组件
			$('[sugartype=select]').selectpicker({
				container: 'body'
			})

			// 保存参数到全局变量
			$.fn.sugarTable.options = $.fn.sugarTable.options || {};
			$.fn.sugarTable.options[_table.id] = options;
		},
		/**
		 * 获取整个表格的输入框内的值
		 * @return {Array} 包含各列键值对的数组，结构：
		 *         [0:{name1:value1_1,name2:value1_2},1:{name1:value2_1,name2:value2_2}]
		 */
		getInputValues: function() {
			var inputValues = [];
			var inputValue = {};
			var lineNum = $.fn.sugarTable.options[this.attr('id')].count;
			for (var i = 0; i < lineNum; i++) {
				inputValue = {};
				this.find('[sugartype=input][sugarline=' + i + ']').each(function(index, el) {
					inputValue[el.attributes.sugarid.value] = el.value;
				});
				inputValues.push(inputValue);
			}
			return inputValues;
		},
		/**
		 * 获取表格中指定输入框内的值
		 * @param  {Object} opts 附加参数
		 *                       id 		同field.id
		 *                       lineNum  	指定表格行数，从1开始
		 * @return {Array} 包含各列键值对的数组，结构：
		 *         [0:{name1:value1_1,name2:value1_2},1:{name1:value2_1,name2:value2_2}]
		 * @return {String} 如果只有一个匹配输入框，则返回该输入框的值
		 */
		getInputValue: function(opts) {
			var findStr = '[sugartype=input]';
			if (typeof opts.id !== "undefined") {
				findStr += '[sugarid=' + opts.id + ']';
			}
			if (typeof opts.lineNum !== "undefined") {
				findStr += '[sugarline=' + (opts.lineNum - 1) + ']';
			}
			if (this.find(findStr).length > 1) {
				var inputValues = [];
				var inputValue = {};
				var lineNum = $.fn.sugarTable.options[this.attr('id')].count;
				for (var i = 0; i < lineNum; i++) {
					inputValue = {};
					this.find('[sugartype=input][sugarline=' + i + ']').each(function(index, el) {
						if (typeof opts.id !== "undefined" && el.attributes.sugarid.value !== opts.id) {
							return;
						} else if (typeof opts.lineNum !== "undefined" && i !== (opts.lineNum - 1)) {
							return;
						} else {
							inputValue[el.attributes.sugarid.value] = el.value;
						}
					});
					inputValues.push(inputValue);
				}
				return inputValues;
			} else if (this.find(findStr).length === 1) {
				return this.find(findStr).val();
			} else {
				return "";
			}
		},
		/**
		 * 获取整个表格的选择框内的值
		 * @return {Array} 包含各列键值对的数组，结构：
		 *         [0:{name1:value1_1,name2:value1_2},1:{name1:value2_1,name2:value2_2}]
		 */
		getSelectValues: function() {
			var selectValues = [];
			var selectValue = {};
			var lineNum = $.fn.sugarTable.options[this.attr('id')].count;
			for (var i = 0; i < lineNum; i++) {
				selectValue = {};
				this.find('[sugartype=select][sugarline=' + i + ']').each(function(index, el) {
					selectValue[el.attributes.sugarid.value] = $(el).selectpicker('val');
				});
				selectValues.push(selectValue);
			}
			return selectValues;
		},
		/**
		 * 获取表格中指定选择框内的值
		 * @param  {Object} opts 附加参数
		 *                       id 		同field.id
		 *                       lineNum  	指定表格行数，从1开始
		 * @return {Array} 包含各列键值对的数组，结构：
		 *         [0:{name1:value1_1,name2:value1_2},1:{name1:value2_1,name2:value2_2}]
		 * @return {String} 如果只有一个匹配选择框，则返回该选择框的值
		 */
		getSelectValue: function(opts) {
			var findStr = '[sugartype=input]';
			if (typeof opts.id !== "undefined") {
				findStr += '[sugarid=' + opts.id + ']';
			}
			if (typeof opts.lineNum !== "undefined") {
				findStr += '[sugarline=' + (opts.lineNum - 1) + ']';
			}
			if (this.find(findStr).length > 1) {
				var inputValues = [];
				var inputValue = {};
				var lineNum = $.fn.sugarTable.options[this.attr('id')].count;
				for (var i = 0; i < lineNum; i++) {
					inputValue = {};
					this.find('[sugartype=input][sugarline=' + i + ']').each(function(index, el) {
						if (typeof opts.id !== "undefined" && el.attributes.sugarid.value !== opts.id) {
							return;
						} else if (typeof opts.lineNum !== "undefined" && i !== (opts.lineNum - 1)) {
							return;
						} else {
							inputValue[el.attributes.sugarid.value] = el.value;
						}
					});
					inputValues.push(inputValue);
				}
				return inputValues;
			} else if (this.find(findStr).length === 1) {
				return this.find(findStr).val();
			} else {
				return "";
			}
		},
	};
})(jQuery, window);