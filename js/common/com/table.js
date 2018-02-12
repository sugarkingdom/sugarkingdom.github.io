// 生成列表
function genTableData(opts) {
	var dataList = opts.data || []; // 列表数据源
	var listLength = opts.length || dataList.length; // 生成列表行数
	var count = opts.count || dataList.length; // 列表计数

	var tableDom;
	var theadDom = $("<thead>");
	var tbodyDom = $("<tbody>");
	tableDom = $("#" + opts.id); // 列表ID
	if (typeof tableDom[0] !== "undefined") {
		tableDom[0].className = opts.tableClass || "table table-bordered table-hover"; // 列表样式
	}
	tableDom.empty();

	var pageDom = opts.pageDom || $("#page"); // 分页DOM
	var page = opts.page || 1; // 页数
	var size = opts.pageSize || 10; // 每页数量
	var noPaging = opts.noPaging || false; // 是否需要分页

	var noCheckbox = opts.noCheckbox || false; // 是否需要勾选框

	var needSum = opts.needSum || false; // 是否需要额外统计行
	var sumBaseStrA = "";
	var sumBaseStrB = "";
	var sumCalcObj = {};

	var needFinalSum = opts.needFinalSum || false; // 是否需要额外总计行
	var finalSumCalcObj = {};

	var seriText = opts.seriText || "序号"; // 序号显示文本

	var noHideBtn = opts.noHideBtn || false; // 是否隐藏按钮

	var fields = opts.fields; // 列表列名称
	var trArr = [],
		tr, tr2, tr3,
		theadTr = $("<tr>"),
		tdCheckbox,
		divCheckbox,
		labelCheckbox,
		inputCheckbox,
		seri,
		tdSeri,
		tData,
		tField,
		tdTemp1,
		iTemp1,
		divTemp1,
		inputTemp1,
		selectTemp1,
		listTemp1,
		optionArr1,
		dataTemp1,
		textareaTemp1,
		divTemp2,
		divTemp3;

	// 生成表头
	if (!noCheckbox) {
		theadTr.append($("<th>").append($("<span>").addClass('sr-only').text("勾选框")));
	}
	theadTr.append($("<th>").attr('style', 'width:40px;').html(seriText));
	for (var i in fields) {
		tField = fields[i];
		theadTr.append($("<th>").html(tField.name));
	}
	theadDom.append(theadTr);

	// 生成列表数据
	tbodyDom.empty();
	for (var i = 0; i < listLength; i++) {
		tData = dataList[i] || {};

		tr = $("<tr>");
		inputCheckbox = $("<input type='checkbox'>").attr({
			alt: i,
			name: "td_checkbox",
			class: "styled styled-primary",
			id: opts.id + "_checkbox_" + i,
		});
		labelCheckbox = $("<label>").attr("for", opts.id + "_checkbox_" + i);
		divCheckbox = $("<div>").addClass("checkbox abc-checkbox abc-checkbox-primary td-checkbox").append(inputCheckbox).append(labelCheckbox);
		tdCheckbox = $("<td>").css({
			"text-align": "center",
			"width": "40px",
			"padding-left": "32px"
		}).append(divCheckbox);
		seri = (page - 1) * size + parseInt(i) + 1;
		tdSeri = $("<td>").html(seri);
		if (!noCheckbox) {
			tr.append(tdCheckbox);
		}
		tr.append(tdSeri);

		for (var j in fields) {
			tField = fields[j];
			switch (tField.type) {
				case "text": // 文本
					tdTemp1 = $("<td>").attr({
						id: opts.id + '_' + i + '_' + tField.id,
					}).text(tData[tField.id] || '');
					if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
						tdTemp1.text(accounting.formatMoney(tData[tField.id] || ''));
					}
					tr.append(tdTemp1);
					break;
				case "obj": // 对象
					var obj = tData[tField.id] || {};
					tdTemp1 = $("<td>").attr({
						id: opts.id + '_' + i + '_' + tField.id + '_' + tField.key,
					});
					if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
						tdTemp1.text(accounting.formatMoney(obj[tField.key] || ''));
					} else {
						tdTemp1.text(obj[tField.key] || '');
					}
					tr.append(tdTemp1);
					break;
				case "input": // 输入框
					tdTemp1 = $("<td>");
					inputTemp1 = $("<input type='text'>").addClass('form-control').attr({
						id: opts.id + '_input_' + i + '_' + tField.id,
						name: tField.id,
						placeholder: '请输入' + tField.name
					}).val(tData[tField.id] || '');
					if (typeof tField.isNumber !== "undefined" && tField.isNumber) {
						toNumberInput(inputTemp1, {
							decimalLength: tField.decimalLength || 0,
							allowMinus: tField.allowMinus || false,
							intLength: tField.intLength || 5
						});
					}
					tdTemp1.append(inputTemp1);
					tr.append(tdTemp1);
					break;
				case "select": // 选择框
					tdTemp1 = $("<td>");
					selectTemp1 = $('<select>').addClass('form-control').attr({
						id: opts.id + '_select_' + i + '_' + tField.id,
						name: tField.id,
						alt: i,
						title: '请选择' + tField.name
					});
					if (tField.optionType === "text") {
						listTemp1 = tData[tField.optionId].split(tField.optionSplit);
					}
					if (listTemp1.length > 0) {
						optionArr1 = [];
						optionArr1.push($('<option>').attr({
							selected: '',
							value: ''
						}));
						for (var k = 0; k < listTemp1.length; k++) {
							optionArr1.push($('<option>').attr({
								value: listTemp1[k]
							}).text(listTemp1[k]));
						}
						selectTemp1.append(optionArr1);
					}
					selectTemp1.val(tData[tField.id] || "");

					selectTemp1.on('change', function(event) {
						event.preventDefault();
						dataTemp1 = {
							lineNum: $(this).attr("alt"),
							value: $(this).val(),
						};
						tField.changeHandler.call(this, dataTemp1);
					});
					tdTemp1.append(selectTemp1);
					tr.append(tdTemp1);
					break;
				case "textarea":
					tdTemp1 = $("<td>").css({
						"padding": 0
					});
					textareaTemp1 = $("<textarea>").addClass("from-control").attr({
						id: opts.id + '_textarea_' + i + '_' + tField.id,
						rows: 5
					}).css({
						"width": "100%",
						"resize": "none",
						"padding": "8px",
						"border": "none",
						"background-color": "inherit"
					}).val(tData[tField.id]);
					if (typeof tField.readonly !== "undefined")
						textareaTemp1.attr("readonly", true);
					tdTemp1.append(textareaTemp1);
					tr.append(tdTemp1);
					break;
				case "modal": // 弹出框
					tdTemp1 = $("<td>");
					divTemp1 = $("<div>").addClass('input-group');
					inputTemp1 = $("<input type='text'>").addClass('form-control').attr({
						id: opts.id + '_input_' + i + '_' + tField.showValue,
						placeholder: '请选择' + tField.name,
						readonly: true
					}).val((tData[tField.showValue] || ''));
					divTemp2 = $("<div>").addClass('input-group-addon btn btn-xs btn-danger ' + tField.clearBtnClass).attr({
						id: tField.clearBtnId + '_' + i,
						alt: i,
						style: ((typeof tData[tField.id] !== 'undefined') ? '' : 'display: none;') + ' border-left: 0;',
						'data-toggle': 'tooltip',
						'data-placement': 'left',
						title: '清空' + tField.name
					}).append($("<i>").addClass('fa fa-fw fa-times'));
					divTemp2.tooltip();
					divTemp3 = $("<div>").addClass('input-group-addon btn btn-xs btn-primary ' + tField.selectBtnClass).attr({
						alt: i,
						title: '选择' + tField.name
					}).append($("<i>").addClass('fa fa-fw fa-search'));
					divTemp1.append(inputTemp1).append(divTemp2).append(divTemp3);
					tdTemp1.append(divTemp1);
					tr.append(tdTemp1);
					break;
				case "mix": // 混合
					tdTemp1 = $("<td>");
					for (var k in tField.content) {
						tFieldContent = tField.content[k];
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
					tr.append(tdTemp1);
					break;
				default:
					break;
			}
		}
		if (needSum) { // 需要额外统计行
			sumBaseStrB = "";
			for (var j in opts.sumBaseId) {
				switch (opts.sumBaseId[j].type) {
					case "text":
						sumBaseStrB += tData[opts.sumBaseId[j].id];
						break;
					case "obj":
						sumBaseStrB += tData[opts.sumBaseId[j].id][opts.sumBaseId[j].key];
						break;
					default:
						break;
				}
			}
			if (sumBaseStrA == sumBaseStrB || sumBaseStrA == "") {
				for (var j in opts.sumCalcId) {
					switch (opts.sumCalcId[j].type) {
						case "text":
							sumCalcObj[opts.sumCalcId[j].id] = sumCalcObj[opts.sumCalcId[j].id] || 0;
							sumCalcObj[opts.sumCalcId[j].id] =
								Math.addFloats(sumCalcObj[opts.sumCalcId[j].id],
									parseFloat(tData[opts.sumCalcId[j].id]));
							break;
						case "obj":
							sumCalcObj[opts.sumCalcId[j].id] = sumCalcObj[opts.sumCalcId[j].id] || {};
							sumCalcObj[opts.sumCalcId[j].id][opts.sumCalcId[j].key] = sumCalcObj[opts.sumCalcId[j].id][opts.sumCalcId[j].key] || 0;
							sumCalcObj[opts.sumCalcId[j].id][opts.sumCalcId[j].key] =
								Math.addFloats(sumCalcObj[opts.sumCalcId[j].id][opts.sumCalcId[j].key],
									parseFloat(tData[opts.sumCalcId[j].id][opts.sumCalcId[j].key]));
							break;
						default:
							break;
					}
				}
				sumBaseStrA = sumBaseStrB;
			} else {
				tr2 = $("<tr>");
				tdSeri = $("<td>").text("合计");
				tr2.append(tdSeri);
				for (var j in fields) {
					tField = fields[j];
					switch (tField.type) {
						case "text": // 文本
							tdTemp1 = $("<td>").attr({
								id: opts.id + '_' + i + '_' + tField.id,
							}).text(sumCalcObj[tField.id] || '');
							if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
								tdTemp1.text(accounting.formatMoney(sumCalcObj[tField.id] || ''));
							}
							tr2.append(tdTemp1);
							break;
						case "obj": // 对象
							tdTemp1 = $("<td>").attr({
								id: opts.id + '_' + i + '_' + tField.id + '_' + tField.key,
							});
							sumCalcObj[tField.id] = sumCalcObj[tField.id] || {};
							if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
								tdTemp1.text(accounting.formatMoney(sumCalcObj[tField.id][tField.key] || ''));
							} else {
								tdTemp1.text(sumCalcObj[tField.id][tField.key] || '');
							}
							tr2.append(tdTemp1);
							break;
						default:
							break;
					}
				}
				trArr.push(tr2);
				sumBaseStrA = sumBaseStrB;
				for (var j in opts.sumCalcId) {
					switch (opts.sumCalcId[j].type) {
						case "text":
							sumCalcObj[opts.sumCalcId[j].id] = parseFloat(tData[opts.sumCalcId[j].id]);
							break;
						case "obj":
							sumCalcObj[opts.sumCalcId[j].id][opts.sumCalcId[j].key] = parseFloat(tData[opts.sumCalcId[j].id][opts.sumCalcId[j].key]);
							break;
						default:
							break;
					}
				}
			}
		}

		if (needFinalSum) { // 需要额外总计行
			for (var j in opts.finalSumCalcId) {
				switch (opts.finalSumCalcId[j].type) {
					case "text":
						finalSumCalcObj[opts.finalSumCalcId[j].id] = finalSumCalcObj[opts.finalSumCalcId[j].id] || 0;
						finalSumCalcObj[opts.finalSumCalcId[j].id] =
							Math.addFloats(finalSumCalcObj[opts.finalSumCalcId[j].id],
								parseFloat(tData[opts.finalSumCalcId[j].id]));
						break;
					case "obj":
						finalSumCalcObj[opts.finalSumCalcId[j].id] = finalSumCalcObj[opts.finalSumCalcId[j].id] || {};
						finalSumCalcObj[opts.finalSumCalcId[j].id][opts.finalSumCalcId[j].key] = finalSumCalcObj[opts.finalSumCalcId[j].id][opts.finalSumCalcId[j].key] || 0;
						finalSumCalcObj[opts.finalSumCalcId[j].id][opts.finalSumCalcId[j].key] =
							Math.addFloats(finalSumCalcObj[opts.finalSumCalcId[j].id][opts.finalSumCalcId[j].key],
								parseFloat(tData[opts.finalSumCalcId[j].id][opts.finalSumCalcId[j].key]));
						break;
					default:
						break;
				}
			}
		}

		// 生成列表的每列时的额外处理
		if (typeof opts.rowGenHandler !== "undefined") {
			opts.rowGenHandler.call(this, tData);
		}
		trArr.push(tr);
	}

	if (needSum) { // 需要额外统计行
		tr2 = $("<tr>");
		tdSeri = $("<td>").text("合计");
		tr2.append(tdSeri);
		for (var j in fields) {
			tField = fields[j];
			switch (tField.type) {
				case "text": // 文本
					tdTemp1 = $("<td>").attr({
						id: opts.id + '_' + i + '_' + tField.id,
					}).text(sumCalcObj[tField.id] || '');
					if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
						tdTemp1.text(accounting.formatMoney(sumCalcObj[tField.id] || ''));
					}
					tr2.append(tdTemp1);
					break;
				case "obj": // 对象
					tdTemp1 = $("<td>").attr({
						id: opts.id + '_' + i + '_' + tField.id + '_' + tField.key,
					});
					sumCalcObj[tField.id] = sumCalcObj[tField.id] || '';
					if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
						tdTemp1.text(accounting.formatMoney(sumCalcObj[tField.id][tField.key] || ''));
					} else {
						tdTemp1.text(sumCalcObj[tField.id][tField.key] || '');
					}
					tr2.append(tdTemp1);
					break;
				default:
					break;
			}
		}
		trArr.push(tr2);
	}

	if (needFinalSum) { // 需要额外总计行
		tr3 = $("<tr>");
		tdSeri = $("<td>").text("总计");
		tr3.append(tdSeri);
		for (var j in fields) {
			tField = fields[j];
			switch (tField.type) {
				case "text": // 文本
					tdTemp1 = $("<td>").attr({
						id: opts.id + '_' + i + '_' + tField.id,
					}).text(finalSumCalcObj[tField.id] || '');
					if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
						tdTemp1.text(accounting.formatMoney(finalSumCalcObj[tField.id] || ''));
					}
					tr3.append(tdTemp1);
					break;
				case "obj": // 对象
					tdTemp1 = $("<td>").attr({
						id: opts.id + '_' + i + '_' + tField.id + '_' + tField.key,
					});
					finalSumCalcObj[tField.id] = finalSumCalcObj[tField.id] || '';
					if (typeof tField.isMoney !== "undefined" && tField.isMoney) {
						tdTemp1.text(accounting.formatMoney(finalSumCalcObj[tField.id][tField.key] || ''));
					} else {
						tdTemp1.text(finalSumCalcObj[tField.id][tField.key] || '');
					}
					tr3.append(tdTemp1);
					break;
				default:
					break;
			}
		}
		trArr.push(tr3);
	}

	tbodyDom.append(trArr);
	tableDom.append(theadDom).append(tbodyDom);

	$(".hoverpic").hover(function() {
		if ($(".hoverpicbox").length == 0) {
			$("body").append($("<div>").addClass('hoverpicbox dropdown-menu'));
		}
		$(".hoverpicbox").css("left", $(this).offset().left - 50);
		$(".hoverpicbox").css("top", $(this).offset().top - 100);
		$(".hoverpicbox").html('<img src="' + $.trim($(this).attr('data-pic')) + '" />');
		$(".hoverpicbox").stop(true, true).fadeIn(200);
	}, function() {
		$(".hoverpicbox").stop(true, true).fadeOut(200);
	});
	$(".hoverpic").mousemove(function(e) {
		var Y = $(this).parent().offset().top;
		var X = $(this).parent().offset().left;
		$(".hoverpicbox").css({
			top: (e.pageY + 10) + "px",
			left: (e.pageX + 10) + "px"
		});
	});

	// 查询完成后隐藏左侧按钮
	if (!noHideBtn) {
		$(".btn-begin-hide").hide();
		$(".btn-begin-hide").attr({
			alt: '',
			href: '#'
		});
	}
	if (!noPaging) {
		pageDom.showPage({
			page: page,
			pageSet: 2,
			count: count,
			totalPage: count / size,
			onPage: function(event) {
				page = event.data.page;
				// 查询完成后隐藏左侧按钮
				if (!noHideBtn) {
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

	if (!noCheckbox) {
		var table = tbodyDom[0];
		var rows = tbodyDom.find("tr");
		for (var i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var currentCheckbox = currentRow.getElementsByTagName("input")[0] || {};

			// 勾选checkbox时，对checkbox反向处理，以便在rowClick中统一操作
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
					var checkboxes = tbodyDom.find("input[name=td_checkbox]");
					for (var j = 0; j < checkboxes.length; j++) {
						checkboxes[j].checked = false;
					}
					// 清空所有行样式
					for (var j = 0; j < rows.length; j++) {
						table.rows[j].className = "";
					}
					if (!currentCheckState) {
						currentCheckbox.checked = true;
						row.className = "info";
						if (typeof opts.checkHandler !== "undefined") {
							opts.checkHandler.call(this, currentCheckbox.alt);
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

	// 生成列表后的额外处理
	if (typeof opts.tableGenHandler !== "undefined") {
		opts.tableGenHandler.call(this);
	}
};