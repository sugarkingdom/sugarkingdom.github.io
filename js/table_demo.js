var page = "1";
var size = '10';

$(function() {
	$("#listData").sugarTable({
		data: tableData1,
		count: tableData1.length,
		pageDom: $("#page"),
		page: page,
		pageSize: size,
		fields: [{
			id: "id",
			type: "text",
			name: "id"
		}, {
			id: "text1",
			type: "text",
			name: "文本1"
		}, {
			id: "object1",
			type: "obj",
			key: "key1",
			name: "对象1"
		}, {
			id: "input1",
			type: "input",
			name: "输入框1"
		}, {
			id: "input2",
			type: "input",
			name: "输入框2"
		}, {
			id: "select1",
			type: "select",
			name: "选择框1",
			optionType: 'text',
			optionId: 'select1_options',
			optionSplit: '#',
		}],
	});
	// console.info($("#listData").sugarTable("getInputValues"));

	// console.info($("#listData").sugarTable("getInputValue", {
	// 	id: "value3",
	// 	lineNum: 3
	// }));

	console.info($("#listData").sugarTable("getSelectValues"));

	// genTableData({
	// 	id: "listData",
	// 	data: data.result.list,
	// 	count: data.result.count,
	// 	pageDom: $("#page"),
	// 	page: page,
	// 	pageSize: size,
	// 	fields: [{
	// 		id: "brandName",
	// 		type: "text",
	// 		name: "品牌"
	// 	}, {
	// 		id: "carName",
	// 		type: "text",
	// 		name: "车型"
	// 		// }, {
	// 		// 	id: "image",
	// 		// 	type: "text",
	// 		// 	name: "展示图片"
	// 		// }, {
	// 		// 	id: "remark",
	// 		// 	type: "textarea",
	// 		// 	readonly: true,
	// 		// 	name: "备注"
	// 	}],
	// 	checkHandler: function(i) {
	// 		var obj = data.result.list[i];
	// 		$("#btnView").show();
	// 		$("#btnEdit").show();
	// 		$("#btnDel").show();
	// 		$("#btnExport").show();
	// 		$("#btnView").attr('href', 'carView.html?id=' + obj.id);
	// 		$("#btnEdit").attr('href', 'carEdit.html?id=' + obj.id);
	// 		$("#btnDel").attr('alt', obj.id);
	// 	},
	// 	searchHandler: function(p) {
	// 		searchHandler(p);
	// 	}
	// });
});