/**
 * 创建下拉框
 */
function createSelect(opts) {
	var select = $("#" + opts.id); // 对象ID
	var list = opts.data || []; // 数据列表
	var value = opts.value || "value"; // 值ID
	var name = opts.name || "name"; // 显示ID
	var label = opts.label || ""; // 默认展示文本
	var noLiveSearch = opts.noLiveSearch || false; // 去除下拉框内查询
	var showValue = opts.showValue || ""; // 默认展示值
	if (select.hasClass('form-control-static')) {
		return;
	}
	if (select.length > 0) {
		select.selectpicker("destroy");
		select.html("");
		if (list.length > 0) {
			var optionArr = [];
			optionArr.push($('<option>').attr({
				selected: '',
				value: ''
			}));
			for (var i = 0; i < list.length; i++) {
				if (typeof list[i] === "object") {
					optionArr.push($('<option>').attr({
						value: list[i][value]
					}).text(list[i][name]));
				} else if (typeof list[i] === "string") {
					optionArr.push($('<option>').attr({
						value: list[i]
					}).text(list[i]));
				}
			}
			select.append(optionArr);
		}
		select.attr('title', "请选择" + label);
		select.selectpicker({
			liveSearch: !noLiveSearch
		});
		select.selectpicker("val", showValue);
		if (typeof opts.successHandler !== "undefined") {
			opts.successHandler.call();
		}
		if (typeof opts.changeHandler !== "undefined") {
			select.on('change.bs.select', function(e) {
				opts.changeHandler.call(this, select, select.selectpicker("val"));
			});
		}
	}
}