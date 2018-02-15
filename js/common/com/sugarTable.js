/**
 * 表格组件
 * Required:
 * 		jQuery 1.12.4
 * 		bootstrap 3.3.7
 * 		bootstrap select 1.12.2
 * 		awesome bootstrap checkbox 1.0.0-alpha.5
 */
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
				return $(el).selectpicker('val');
			case 'textarea':
				return el.value;
			default:
				return '';
		}
	};

	/**
	 * 生成表格域（仅内部使用）
	 * @param  {String} type  域类型
	 * @param  {Object} opts  参数
	 * @return {String or Object}  域内容
	 */
	function _genField(type, opts) {
		switch (type) {

			case 'text': // 文本
				var _temp = {};
				_temp.id = opts.id;
				_temp.index = opts.index;
				_temp.listData = opts.listData;
				_temp.fieldData = opts.fieldData;

				if (typeof _temp.fieldData.isMoney !== "undefined" && _temp.fieldData.isMoney) {
					_temp.text = accounting.formatMoney(_temp.listData[_temp.fieldData.id] || '');
				} else {
					_temp.text = _temp.listData[_temp.fieldData.id] || '';
				}
				return _temp.text;

			case 'object': // 对象
				var _temp = {};
				_temp.id = opts.id;
				_temp.index = opts.index;
				_temp.listData = opts.listData;
				_temp.fieldData = opts.fieldData;

				_temp.object = _temp.listData[_temp.fieldData.id] || {};

				// 金额展示处理
				if (typeof _temp.fieldData.isMoney !== "undefined" && _temp.fieldData.isMoney) {
					_temp.text = accounting.formatMoney(_temp.object[_temp.fieldData.key] || '');
				} else {
					_temp.text = _temp.object[_temp.fieldData.key] || '';
				}
				return _temp.text;

			case 'input': // 输入框
				var _temp = {};
				_temp.id = opts.id;
				_temp.index = opts.index;
				_temp.listData = opts.listData;
				_temp.fieldData = opts.fieldData;

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
					toNumberInput(_temp.input, {
						decimalLength: _temp.fieldData.decimalLength || 0,
						allowMinus: _temp.fieldData.allowMinus || false,
						intLength: _temp.fieldData.intLength || 5
					});
				}

				// 赋值逻辑与文本域相同
				_temp.input.val(_genField('text', opts));
				return _temp.input;

			case 'select': // 选择框
				var _temp = {};
				_temp.id = opts.id;
				_temp.index = opts.index;
				_temp.listData = opts.listData;
				_temp.fieldData = opts.fieldData;

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

				if (typeof _temp.fieldData.changeHandler !== 'undefined') {
					_temp.select.on('change', function(event) {
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
				var _temp = {};
				_temp.id = opts.id;
				_temp.index = opts.index;
				_temp.listData = opts.listData;
				_temp.fieldData = opts.fieldData;

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

			default:
				return '';
		}
	}

	var methods = {
		/**
		 * 初始化组件
		 * @param  {Object} options 参数
		 * @return
		 */
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
			_table.theadTr.append($("<th>").attr('style', 'width:40px;').html(_table.o.seriText));

			// 构造表头
			$.each(_table.o.fields, function(fieldIndex, fieldData) {
				_table.theadTr.append($("<th>").css('width', fieldData.width || 'auto').html(fieldData.name));
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
						// id: _table.id + "_checkbox_" + listIndex,
						class: "styled styled-primary",
						sugarid: listIndex,
						sugarline: listIndex,
						sugartype: 'line_checkbox',
					});
					_list.labelCheckbox = $("<label>").attr("for", _table.id + "_checkbox_" + listIndex);
					_list.divCheckbox = $("<div>").addClass("checkbox abc-checkbox abc-checkbox-primary").append(_list.inputCheckbox).append(_list.labelCheckbox);
					_list.tdCheckbox = $("<td>").addClass('sugar-checkbox').append(_list.divCheckbox);
					_list.tr.append(_list.tdCheckbox);
				}

				// 构造序号列
				_list.seri = (_table.o.page - 1) * _table.o.pageSize + parseInt(listIndex) + 1;
				_list.tdSeri = $("<td>").addClass('seri').html(_list.seri);
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

				/**
				 * 构造表格域-对象
				 * @param  {Object} opts 参数
				 * @return {String}      表格内文本
				 */
				_list.genField_object = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

					_temp.object = _temp.listData[_temp.fieldData.id] || {};
					_temp.text = _temp.object[_temp.fieldData.key] || '';
					if (typeof _temp.fieldData.isMoney !== "undefined" && _temp.fieldData.isMoney) {
						_temp.text = accounting.formatMoney(_temp.object[_temp.fieldData.key] || '');
					} else {
						_temp.text = _temp.object[_temp.fieldData.key] || '';
					}
					return _temp.text;
				};

				/**
				 * 构造表格域-输入框
				 * @param  {Object} opts 参数
				 * @return {Element}     input元素
				 */
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

					// 赋值逻辑与文本域相同
					_temp.input.val(_list.genField_text(opts));
					return _temp.input;
				};

				/**
				 * 构造表格域-选择框
				 * @param  {Object} opts 参数
				 * @return {Element}     select元素
				 */
				_list.genField_select = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

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

					if (typeof _temp.fieldData.changeHandler !== 'undefined') {
						_temp.select.on('change', function(event) {
							event.preventDefault();
							this.data = {
								lineNum: $(this).attr("sugarline"),
								value: $(this).val(),
							};
							_temp.fieldData.changeHandler.call(this, this.data);
						});
					}
					return _temp.select;
				};

				/**
				 * 构造表格域-文本框
				 * @param  {Object} opts 参数
				 * @return {String}      表格内文本
				 */
				_list.genField_textarea = function(opts) {
					var _temp = {};
					_temp.id = opts.id;
					_temp.index = opts.index;
					_temp.listData = opts.listData;
					_temp.fieldData = opts.fieldData;

					this.textarea = $("<textarea>").addClass("from-control").attr({
						// id: id + '_textarea_' + index + '_' + fieldData.id,
						rows: _temp.fieldData.row || 5,
						sugarline: _temp.index,
						sugarid: _temp.fieldData.id,
						sugartype: 'textarea',
					}).val(_temp.listData[_temp.fieldData.id]);
					if (typeof _temp.fieldData.readonly !== "undefined") {
						this.textarea.attr("readonly", true);
					}
					return this.textarea;
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
								// id: _table.id + '_' + listIndex + '_text_' + fieldData.id,
								sugarline: listIndex,
								sugarid: fieldData.id,
								sugartype: 'text',
							});
							_list.td.append(_genField('text', {
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "object": // 对象
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + listIndex + '_object_' + fieldData.id + '_' + fieldData.key,
								sugarline: listIndex,
								sugarid: fieldData.id,
								sugarkey: fieldData.key,
								sugartype: 'object',
							});
							_list.td.append(_genField('object', {
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "input": // 输入框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + listIndex + '_input_' + fieldData.id,
							});
							_list.td.append(_genField('input', {
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "select": // 选择框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + listIndex + '_select_' + fieldData.id,
							});
							_list.td.append(_genField('select', {
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
							break;
						case "textarea": // 文本输入框
							_list.td = $("<td>").attr({
								// id: _table.id + '_' + listIndex + '_select_' + fieldData.id,
							}).addClass('sugar-textarea');
							_list.td.append(_genField('textarea', {
								id: _table.id,
								index: listIndex,
								listData: listData,
								fieldData: fieldData
							}));
							_list.tr.append(_list.td);
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

			// 构造分页组件
			if (!_table.o.noPaging) {
				_table.o.pageDom.sugarPage({
					page: _table.o.page,
					pageSet: 2,
					count: _table.o.count,
					totalPage: _table.o.count / _table.o.pageSize,
					onPage: function(event) {
						page = event.data.page;
						// 查询完成后隐藏左侧按钮
						if (!_table.o.noHideBtn) {
							$(".btn-begin-hide").hide();
							$(".btn-begin-hide").attr({
								alt: '',
								href: '#'
							});
						}
						opts.searchHandler.call(this, page);
					}
				});
			}

			// 处理选中事件
			if (!_table.o.noCheckbox) {
				var _tbody_first = _table.tbody[0];
				var _tbody_rows = _table.tbody.find("tr");
				for (var i = 0; i < _tbody_rows.length; i++) {
					var currentRow = _tbody_first.rows[i];
					var currentCheckbox = currentRow.getElementsByTagName("input")[0] || {};

					// 点击checkbox区域时，对checkbox反向处理，以便在rowClick中统一操作
					var checkboxClickHandler = function(checkbox) {
						return function() {
							checkbox.checked = !checkbox.checked;
						}
					}
					currentCheckbox.onclick = checkboxClickHandler(currentCheckbox);

					var rowClickHandler = function(row) {
						return function() {
							var currentCheckbox = row.getElementsByTagName("input")[0] || {};
							var currentCheckState = currentCheckbox.checked || false;
							// 清空所有checkbox
							var checkboxes = _table.tbody.find("input[sugartype=line_checkbox]");
							for (var j = 0; j < checkboxes.length; j++) {
								checkboxes[j].checked = false;
							}
							// 清空所有行样式
							for (var j = 0; j < _tbody_rows.length; j++) {
								_tbody_first.rows[j].className = "";
							}
							if (!currentCheckState) {
								currentCheckbox.checked = true;
								row.className = "info";
								if (typeof _table.o.checkHandler !== "undefined") {
									_table.o.checkHandler.call(this, currentCheckbox.sugarline);
								}
							} else {
								// 隐藏左侧按钮
								$(".btn-begin-hide").hide();
								$(".btn-begin-hide").attr({
									alt: '',
									href: '#'
								});
							}
						};
					};
					currentRow.onclick = rowClickHandler(currentRow);
				}
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
		getValues: function() {
			var values = [];
			var value = {};
			var lineNum = $.fn.sugarTable.options[this.attr('id')].count;
			for (var i = 0; i < lineNum; i++) {
				value = {};
				this.find('[sugartype][sugarline=' + i + ']').each(function(index, el) {
					value[el.attributes.sugarid.value] = _getValue(el);
				});
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
		getValue: function(opts) {
			var findStr = '[sugartype]';
			if (typeof opts.id !== "undefined") {
				findStr += '[sugarid=' + opts.id + ']';
			}
			if (typeof opts.lineNum !== "undefined") {
				findStr += '[sugarline=' + (opts.lineNum - 1) + ']';
			}
			if (this.find(findStr).length > 1) {
				var values = [];
				var value = {};
				var lineNum = $.fn.sugarTable.options[this.attr('id')].count;
				for (var i = 0; i < lineNum; i++) {
					value = {};
					this.find('[sugartype][sugarline=' + i + ']').each(function(index, el) {
						if (typeof opts.id !== "undefined" && el.attributes.sugarid.value !== opts.id) {
							return;
						} else if (typeof opts.lineNum !== "undefined" && i !== (opts.lineNum - 1)) {
							return;
						} else {
							value[el.attributes.sugarid.value] = _getValue(el);
						}
					});
					values.push(value);
				}
				return values;
			} else if (this.find(findStr).length === 1) {
				return _getValue(this.find(findStr)[0]);
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
	$.fn.sugarPage = function(options) {
		if (!this.length) {
			return;
		}
		var defaultOptions = $.data(this[0], 'pageOptions');
		if (!defaultOptions) {
			defaultOptions = {
				page: 0,
				pageSet: 2,
				totalPage: 0
			}
		}
		options = $.extend(defaultOptions, options);
		$.data(this[0], 'pageOptions', options);

		var page = Math.ceil(parseFloat(options.page));
		var set = Math.ceil(parseFloat(options.pageSet));
		var total = Math.ceil(parseFloat(options.totalPage));
		var count = Math.ceil(parseFloat(options.count));
		var hasEvent = typeof(options.onPage) == "function";

		var $ul = $('<ul class="pagination"></ul>');
		var $span = $('<span class="pageinfo"></span>');
		this.empty();
		this.append($ul);
		this.append($span);
		$span.text("第 " + page + " 页，共 " + total + " 页， " + count + " 条记录");
		if (total > 0) {
			var $first = $('<li><a href="javascript:;"><i class="fa fa-step-backward"></i></a></li>');
			var $pre = $('<li><a href="javascript:;"><i class="fa fa-backward"></i></a></li>');
			if (page <= 0) {
				page = 1;
			}
			if (page > total) {
				page = total; // 当前页数变更需要通知组件onPage
				$first.on("click", {
					page: page
				}, options.onPage);
			}
			if (page > 1) {
				$ul.append($first).append($pre);
				if (hasEvent) {
					$first.on("click", {
						page: 1
					}, options.onPage);
					$pre.on("click", {
						page: page - 1
					}, options.onPage);
				}
			} else {
				$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-step-backward"></a></li>')
				$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-backward"></i></a></li>');
			}
			if (page - set > 2) {
				var $li = $('<li><a href="javascript:;">1</a></li>');
				$ul.append($li).append('<li><a href="javascript:;">...</a></li>');
				if (hasEvent) {
					$li.on("click", {
						page: 1
					}, options.onPage);
				}
				for (var i = page - set; i < page; i++) {
					$li = $('<li><a href="javascript:;">' + i + '</a></li>');
					$ul.append($li);
					if (hasEvent) {
						$li.on("click", {
							page: i
						}, options.onPage);
					}
				}
			} else {
				for (var i = 1; i < page; i++) {
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
				var $li;
				for (var i = page + 1; i <= (page + set); i++) {
					$li = $('<li><a href="javascript:;">' + i + '</a></li>');
					$ul.append($li);
					if (hasEvent) {
						$li.on("click", {
							page: i
						}, options.onPage);
					}
				}
				$li = $('<li><a href="javascript:;">' + total + '</a></li>');
				$ul.append('<li><a href="javascript:;">...</a></li>').append($li);
				if (hasEvent) {
					$li.on("click", {
						page: total
					}, options.onPage);
				}
			} else {
				for (var i = page + 1; i <= total; i++) {
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
				var $last = $('<li><a href="javascript:;"><i class="fa fa-step-forward"></i></a></li>');
				$ul.append($next).append($last);
				if (hasEvent) {
					$last.on("click", {
						page: total
					}, options.onPage);
					$next.on("click", {
						page: page + 1
					}, options.onPage);
				}
			} else {
				$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-forward"></i></a></li>')
				$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-step-forward"></i></a></li>');
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
	}
})(jQuery, window);