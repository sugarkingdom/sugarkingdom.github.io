(function($) {
	$.extend({
		urlGet: function() {
			var aQuery = window.location.href.split("?"); // 取得Get参数
			var aGET = new Array();
			if (aQuery.length > 1) {
				var query = aQuery[1];
				var i = query.lastIndexOf("#");
				if (i >= 0) {
					query = query.substring(0, i);
				}
				var aBuf = query.split("&");
				for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
					var aTmp = aBuf[i].split("="); // 分离key与Value
					aGET[aTmp[0]] = aTmp[1];
				}
			}
			return aGET;
		},
		getFormData: function(form) {
			var formData = form.serializeArray().reduce(function(obj, item) {
				obj[item.name] = item.value;
				return obj;
			}, {});
			return formData;
		}
	});

	$.p = {
		ajax: function(url, param, option) {
			if (param != null)
				param = JSON.stringify(param);
			option = option || {};
			$.ajax({
				url: P.rootPath + 'rest/' + url,
				data: param,
				method: option.method || "post",
				async: option.async || true,
				dataType: option.dataType || "json",
				contentType: option.contentType || "application/json",
				xhrFields: {
					withCredentials: true
				},
				success: function(result, status, xhr) {
					if (xhr.status == 200) {
						if (option.visitor) {
							if (typeof option.success !== "undefined") {
								option.success.call(this, result, status, xhr)
							}
						} else {
							if (result.status == 2) {
								window.location.href = P.rootPath + "admin/login.html";
							} else if (result.status == 3) {
								window.location.href = P.rootPath + "weixin/index.html";
							} else if (result.status == 6) {
								window.location.href = P.rootPath + "login.html";
							} else if (typeof option.success !== "undefined") {
								option.success.call(this, result, status, xhr);
							}
						}
					} else {
						showInfo(3, "交易失败-" + xhr.status);
					}
				}
			});
		},
		confirm: function(msg, callback) {
			bootbox.confirm({
				message: msg,
				buttons: {
					confirm: {
						label: '确 认',
						className: 'btn-primary btn-confirm'
					},
					cancel: {
						label: '关 闭',
						className: 'btn-default btn-cancel pull-right'
					}
				},
				backdrop: true,
				size: 'small',
				callback: function(result) {
					if (result && typeof callback !== "undefined") {
						callback.call();
					}
				}
			});
		},
		dialog: function(msg, callback) {
			var dialog = bootbox.dialog({
				message: '<p class="text-center">' + msg + '</p>',
				closeButton: false
			});
			setTimeout(function() {
				dialog.modal('hide');
				if (typeof callback !== "undefined") {
					callback.call();
				}
			}, 2000);
		},
		treeview: function(domElement, targetData, opts) {
			targetData = targetData || [];
			var defaultOpts = $.extend(true, {
				showIcon: false,
				showCheckbox: true,
				showTags: false,
				bootstrap2: false,
				checkedIcon: "fa fa-fw fa-check-square-o",
				uncheckedIcon: "fa fa-fw fa-square-o",
				expandIcon: "fa fa-fw fa-angle-down",
				collapseIcon: "fa fa-fw fa-angle-right",
				onNodeSelected: function(event, node) {
					if (typeof node !== "undefined") {
						if (node.state.checked) {
							domElement.treeview('uncheckNode', node.nodeId);
						} else {
							domElement.treeview('checkNode', node.nodeId);
						}
						setTimeout(function() {
							domElement.treeview('unselectNode', node.nodeId);
						}, 100);
					}
				},
				onNodeChecked: function(event, node) {
					checkNode(node, "up");
					checkNode(node, "down");
				},
				onNodeUnchecked: function(event, node) {
					uncheckNode(node, "up");
					uncheckNode(node, "down");
				}

			}, opts);

			domElement.treeview(defaultOpts);

			// 迭代勾选节点
			function checkNode(node, direction) {
				if (typeof opts.checkNodeFunc !== "undefined") {
					opts.checkNodeFunc(node, direction);
					return;
				}
				if (targetData.indexOf(node.id) == -1) {
					targetData.push(node.id);
					node.state.checked = true;
				}
				// 勾选上一级父节点
				if (direction == "up") {
					var parentNode = domElement.treeview('getParent', node);
					if (typeof parentNode.nodeId !== "undefined") {
						checkNode(parentNode, "up");
					}
				} else if (direction == "down") {
					if (typeof node.nodes !== "undefined" && node.nodes.length > 0) {
						// 有子节点
						for (var i in node.nodes) {
							// 勾选所有子节点
							domElement.treeview('checkNode', [node.nodes[i].nodeId, {
								silent: true
							}]);
							checkNode(node.nodes[i], "down");
						}
					} else {
						// 是末节点
						if (targetData.indexOf(node.id) == -1) {
							targetData.push(node.id);
							node.state.checked = true;
							// console.info(targetData);
						}
					}
				}
			}

			// 迭代取消勾选节点
			function uncheckNode(node, direction) {
				if (typeof opts.uncheckNodeFunc !== "undefined") {
					opts.uncheckNodeFunc(node, direction);
					return;
				}
				if (targetData.indexOf(node.id) != -1) {
					targetData.splice(targetData.indexOf(node.id), 1);
					node.state.checked = false;
					// console.info(targetData);
				}
				// 如果同级子节点全未勾选，则取消勾选上一级父节点
				if (direction == "up") {
					var parentNode = domElement.treeview('getParent', node);
					if (typeof parentNode.nodeId !== "undefined") {
						var parentNodeFlag = false;
						for (var i in parentNode.nodes) {
							parentNodeFlag = parentNodeFlag || parentNode.nodes[i].state.checked;
						}
						if (!parentNodeFlag) {
							uncheckNode(parentNode, "up");
						}
					}
				} else if (direction == "down") {
					if (typeof node.nodes !== "undefined" && node.nodes.length > 0) {
						// 有子节点
						for (var i in node.nodes) {
							// 取消勾选所有子节点
							domElement.treeview('uncheckNode', [node.nodes[i].nodeId, {
								silent: true
							}]);
							uncheckNode(node.nodes[i], "down");
						}
					} else {
						// 是末节点
						if (targetData.indexOf(node.id) != -1) {
							targetData.splice(targetData.indexOf(node.id), 1);
							node.state.checked = false;
							// console.info(targetData);
						}
					}
				}
			}
		},
		validate: function(domElement, fields, successHandler, opts) {
			this.domElement = domElement;
			var defaultOpts = $.extend(true, {
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon fa-spin glyphicon-refresh'
				},
				excluded: [":disabled"]
			}, opts);
			var fieldOpts = {};
			for (var i in fields) {
				fieldOpts[fields[i].fieldId] = {
					validators: {}
				};
				if (fields[i].notEmpty) {
					fieldOpts[fields[i].fieldId].validators.notEmpty = {
						message: fields[i].fieldName + "不能为空"
					};
				}
				if (fields[i].stringLength) {
					fieldOpts[fields[i].fieldId].validators.stringLength = {
						min: fields[i].stringLength.min,
						max: fields[i].stringLength.max,
						message: fields[i].fieldName + "长度必须在" + fields[i].stringLength.min + "到" + fields[i].stringLength.max + "之间"
					};
				}
				if (fields[i].remoteUrl) {
					fieldOpts[fields[i].fieldId].validators.remote = {
						url: P.rootPath + "rest/" + fields[i].remoteUrl,
						message: fields[i].remoteMsg,
						type: "post",
						dataType: 'json',
						delay: 500
					};
					if (typeof fields[i].data !== "undefined") {
						fieldOpts[fields[i].fieldId].validators.remote.data = fields[i].data
					}
				}
				if (fields[i].trigger) {
					fieldOpts[fields[i].fieldId].trigger = fields[i].trigger;
				}
				if (fields[i].emailAddress) {
					fieldOpts[fields[i].fieldId].validators.emailAddress = {
						message: "邮箱格式不正确"
					};
				}
				if (fields[i].amount) {
					fieldOpts[fields[i].fieldId].validators.regexp = {
						regexp: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
						message: fields[i].fieldName + "数字类型不正确"
					};
				}
			}
			defaultOpts.fields = fieldOpts;
			domElement.bootstrapValidator(defaultOpts).on('success.form.bv', function(e) {
				e.preventDefault();
				if (successHandler !== "undefined") {
					successHandler.call();
				}
			});
		},
		resetValidate: function(domElement) {
			domElement.data('bootstrapValidator').resetForm();
		},
		/**
		 * 取得字符长度
		 *
		 * @param str
		 * @returns
		 */
		getStrLength: function(str) {
			var cArr = str.match(/[^\x00-\xff]/ig);
			return str.length + (cArr == null ? 0 : cArr.length);
		},
		validateNull: function(dom) {
			var flag = true,
				equiredDoms = $(".required"),
				domTagName = null;
			if (dom != null && typeof dom !== "undefined") {
				equiredDoms = dom.find(".required");
			}
			equiredDoms.each(function() {
				domTagName = $(this)[0].tagName;
				switch (domTagName) {
					case "INPUT":
						if ($(this).val().trim() == "") {
							flag = false;
							showInfo(false, $(this).attr("requiredName") + "不能为空");
							return flag;
						}
				}
			});
			return flag;
		}
	};
})(jQuery);

function formValidate(form, submitHandler) {
	$(form).validate({
		errorPlacement: function(error, element) { // 指定错误信息位置
			if (element.is(':radio') || element.is(':checkbox')) {
				var eid = element.attr('name');
				error.appendTo(element.parent());
			} else {
				error.insertAfter(element);
			}
		},
		errorClass: "help-block",
		errorElement: "span",
		highlight: function(element, errorClass, validClass) {
			$(element).parent().parent('.form-group').removeClass("has-success").addClass('has-error');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).parent().parent('.form-group').removeClass('has-error');
			$(element).parent().parent('.form-group').addClass('has-success');
		}
	});
	$(form).find(".submit").removeAttr("disabled");
	$(form).unbind("submit");
	$(form).submit(function() {
		if ($(form).validate().form()) {
			$(form).find(".submit").attr("disabled", "disabled");
			submitHandler();
		}
		return false;
	});
}

function showInfo(flag, msg, callback) {
	var bg, ico;
	switch (flag) {
		case 1:
			bg = "bg-primary";
			ico = "fa-check-circle";
			break;
		case 2:
			bg = "bg-warning";
			ico = "fa-exclamation-triangle";
			break;
		case 3:
			bg = "bg-danger";
			ico = "fa-times-circle";
			break;
	}
	var $msgbox = $('<div class="msgbox ' + bg + '"><i class="fa ' + ico + '"></i> &nbsp;' + msg + '</div>');
	$('body').append($msgbox);
	$msgbox.css("top", ($(window).height() - $msgbox.height()) / 2);
	$msgbox.css("left", ($(window).width() - $msgbox.width() - 20) / 2);
	$msgbox.fadeIn(300).delay(2000).fadeOut(300, function() {
		$msgbox.remove();
		if (typeof callback !== "undefined") {
			callback.call();
		}
	});
}

/**
 * 查看页面和编辑页面初始化分别赋值时使用
 *
 * @param obj	DOM
 * @param val	数据
 */
function setDomValue(obj, val) {
	if ($(obj).hasClass("form-control-static")) {
		$(obj).text(val);
	} else {
		$(obj).val(val);
	}
}

/**
 * 获取元素值
 *
 * @param obj	DOM
 * @param val	数据
 */
function getDomValue(obj) {
	if ($(obj).hasClass("form-control-static")) {
		return $(obj).html();
	} else {
		return $(obj).val();
	}
}