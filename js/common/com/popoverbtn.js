// 生成气泡按钮
function genPopoverBtn(opts) {
	var btnDom = $("#" + opts.id);
	var dataList = opts.data.list; // 列表数据源
	var listLength = dataList.length;
	var tableDom = $("<table>").css('marginBottom', '0');
	var theadDom = $("<thead>");
	var tbodyDom = $("<tbody>");
	tableDom[0].className = opts.tableClass || "table table-bordered table-condensed"; // 列表样式
	tableDom.empty();

	var seriText = opts.seriText || "序号"; // 序号显示文本

	var fields = opts.fields; // 列表列名称

	var trArr = [],
		tr,
		theadTr = $("<tr>"),
		seri,
		tdSeri,
		tData,
		tField,
		tdTemp1;

	theadTr.append($("<th>").html(seriText));
	theadDom.append(theadTr);
	for (var i in fields) {
		tField = fields[i];
		theadTr.append($("<th>").html(tField.name));
	}

	// 生成列表数据
	tbodyDom.empty();
	for (var i = 0; i < listLength; i++) {
		tData = dataList[i] || {};

		tr = $("<tr>");

		seri = parseInt(i) + 1;
		tdSeri = $("<td>").html(seri);
		tr.append(tdSeri);

		for (var j in fields) {
			tField = fields[j];
			tdTemp1 = $("<td>").attr({
				id: opts.id + '_' + i + '_' + tField.id,
			}).text(tData[tField.id] || '');
			tr.append(tdTemp1);
		}
		trArr.push(tr);
	}
	tbodyDom.append(trArr);
	tableDom.append(theadDom).append(tbodyDom);
	var divRow = $("<div>").addClass('row').css({
		"maxHeight": '400px',
		"overflow": 'auto'
	});
	var divFormGroup = $("<div>").addClass('form-group').css({
		"marginBottom": '0',
	});
	divRow.append(divFormGroup.append(tableDom));
	btnDom.popover({
		trigger: 'manual',
		placement: 'bottom',
		content: divRow,
		html: 'true'
	});

	btnDom.popover('toggle');
}