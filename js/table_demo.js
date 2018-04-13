var tableData1 = [{
	id: 1,
	text1: '1_1 文本内容',
	object1: {
		key1: "1_2 对象内容"
	},
	input1: '1_3 输入框',
	input2: '1_4 输入框',
	select1: '1_5 选择框 01',
	select1_options: '1_5 选择框 01#1_5 选择框 02#1_5 选择框 03',
	select2: '1_6 选择框 03',
	select2_options: ['1_6 选择框 01', '1_6 选择框 02', '1_6 选择框 03'],
}, {
	id: 2,
	text1: '2_1 文本内容',
	object1: {
		key1: "2_2 对象内容"
	},
	input1: '2_3 输入框',
	input2: '2_4 输入框',
	select1: '2_5 选择框 02',
	select1_options: '2_5 选择框 01#2_5 选择框 02#2_5 选择框 03',
	select2: '2_6 选择框 02',
	select2_options: ['2_6 选择框 01', '2_6 选择框 02', '2_6 选择框 03'],
}, {
	id: 3,
	text1: '3_1 文本内容',
	object1: {
		key1: "3_2 对象内容"
	},
	input1: '3_3 输入框',
	input2: '3_4 输入框',
	select1: '3_5 选择框 03',
	select1_options: '3_5 选择框 01#3_5 选择框 02#3_5 选择框 03',
	select2: '3_6 选择框 01',
	select2_options: ['3_6 选择框 01', '3_6 选择框 02', '3_6 选择框 03'],
}];

var tableData2 = [{
	id: 1,
	textarea1: '1_1 文本框内容 01\n1_1 文本框内容 02\n1_1 文本内容 03',
	sex: 1,
	headImgUrl: "01.png"
}, {
	id: 2,
	textarea1: '2_1 文本框内容 01\n2_1 文本框内容 02\n2_1 文本内容 03',
	sex: 2,
	headImgUrl: "02.png"
}, {
	id: 3,
	textarea1: '3_1 文本框内容 01\n3_1 文本框内容 02\n3_1 文本内容 03',
	sex: 3,
	headImgUrl: "03.png"
}];

var tableData3 = [{
	id: 1,
	money1: 1000,
	money1Tag: "1",
	money2: 3000,
	money2Tag: "2",
}, {
	id: 2,
	money1: 2000,
	money1Tag: "1",
	money2: 2000,
	money2Tag: "3",
}, {
	id: 3,
	money1: 3000,
	money1Tag: "2",
	money2: 1000,
	money2Tag: "3",
}, {
	id: 3,
	money1: 2000,
	money1Tag: "2",
	money2: 2000,
	money2Tag: "3",
}];

var page1 = "1";
var size1 = '10';

var page2 = "1";
var size2 = '10';

var page3 = "1";
var size3 = '10';

$(function() {
	$("#listData1").sugarTable({
		list: tableData1,
		count: tableData1.length,
		pageDom: $("#page1"),
		page: page1,
		pageSize: size1,
		fields: [{
			id: "id",
			type: "text",
			name: "id",
		}, {
			id: "text1",
			type: "text",
			name: "文本1",
			width: "200",
		}, {
			id: "object1",
			type: "object",
			key: "key1",
			name: "对象1",
			width: "200",
		}, {
			id: "input1",
			type: "input",
			name: "输入框1",
			width: "200",
		}, {
			id: "input2",
			type: "input",
			name: "输入框2",
			width: "200",
		}, {
			id: "select1",
			type: "select",
			name: "选择框1",
			width: "200",
			optionType: 'text',
			optionId: 'select1_options',
			optionSplit: '#',
			changeHandler: function(data) {
				console.info(data);
			}
		}, {
			id: "select2",
			type: "select",
			name: "选择框2",
			width: "200",
			optionType: 'array',
			optionId: 'select2_options',
		}],
	});

	// console.info($("#listData1").sugarTable("getValues"));

	// console.info($("#listData1").sugarTable("getValue", {
	// 	id: "select2",
	// 	lineNum: 3
	// }));

	$("#listData2").sugarTable({
		list: tableData2,
		count: tableData2.length,
		pageDom: $("#page2"),
		page: page2,
		pageSize: size2,
		fields: [{
			id: "id",
			type: "text",
			name: "id"
		}, {
			id: "textarea1",
			type: "textarea",
			name: "文本框1",
			readonly: true
		}, {
			type: "mix",
			name: "什么",
			content: [{
				id: "sex",
				type: "icon",
				preset: "sex",
				sexId: "sex",
				sexOrder: ["1", "2", "3"],
				hoverImage: "headImgUrl",
				prePath: "https://sugarkingdom.github.io/upload/"
			}, {
				id: "sex",
				type: "icon",
				preset: "pic",
				imagePath: "headImgUrl",
				prePath: "https://sugarkingdom.github.io/upload/"
			}, {
				id: "id",
				type: "text",
				name: "id"
			}],
		}],
	});

	// console.info($("#listData2").sugarTable("getValues"));

	// console.info($("#listData2").sugarTable("getValue", {
	// 	id: "textarea1",
	// 	lineNum: 3
	// }));

	$("#listData3").sugarTable({
		list: tableData3,
		count: tableData3.length,
		pageDom: $("#page3"),
		page: page3,
		pageSize: size3,
		needSum: true,
		sumBaseGroup: [{
			type: "text",
			id: "money1Tag",
		}, {
			type: "text",
			id: "money2Tag",
		}],
		sumCalcGroup: [{
			type: "text",
			id: "money1",
		}],
		needFinalSum: true,
		finalSumCalcGroup: [{
			type: "text",
			id: "money1",
		}],
		fields: [{
			id: "id",
			type: "text",
			name: "id"
		}, {
			id: "money1",
			type: "text",
			name: "金额1",
			isMoney: true,
			moneySymbol: "￥",
		}, {
			id: "money1Tag",
			type: "text",
			name: "金额1标签",
		}, {
			id: "money2",
			type: "text",
			name: "金额2",
			isMoney: true,
			moneySymbol: "￥",
		}, {
			id: "money2Tag",
			type: "text",
			name: "金额2标签",
		}],
	});

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