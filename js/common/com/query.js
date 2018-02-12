// 查询条件生成
//	qdata: 字段ID
//	qvalue: 字段值
//	qtype: 处理类型：
//		"="			-	等于
//		"gt"		-	大于
//		"lt"		-	小于
//		"gt="		-	大于等于
//		"lt="		-	小于等于
//		"like"		-	全模糊
//		"likel"		-	左模糊
//		"liker"		-	右模糊
function getQueryEX(obj) {
	var result = {};
	var query = [];
	var sort = [];
	obj.find("[qdata]").each(function() {
		$this = $(this);
		var qdata = $this.attr("qdata");
		var val;
		var qcomp = $this.attr("qcomp");
		if (qcomp !== undefined) {
			switch (qcomp) {
				case "select": // 选择组件
					val = $this.selectpicker("val");
					break;
				case "datetime": // 日期组件-毫秒
					if ($this.datepicker("getDate") != null)
						val = $this.datepicker("getDate").getTime() / 1000;
					break;
				case "datestr": // 日期组件-文本
					// val = $this.datepicker("getStrDate");
					break;
				default:
					break;
			}
		} else {
			val = $this.val();
		}
		if (qdata) {
			if (val) {
				var qvalue = $this.attr("qvalue");
				if (qvalue) {
					result[qvalue] = val;
				} else {
					result[qdata] = val;
				}
				if ($this.attr("qtype")) {
					var data = {
						field: qdata,
						type: $this.attr("qtype")
					}
					if (qvalue) {
						data.value = qvalue;
					}
					query.push(data);
				}
				if ($this.attr("qsort")) {
					sort.push({
						field: qdata,
						ascend: $this.attr("qsort") == "ascend"
					})
				}
			}
		}
	})
	if (query.length > 0) {
		result.query = query;
	}
	if (sort.length > 0) {
		result.qsort = sort;
	}
	return result;
}

// 查询条件重置
function resetQueryEX(obj) {
	obj.find("[qdata]").each(function() {
		$this = $(this);
		var qcomp = $this.attr("qcomp");
		if (qcomp !== undefined) {
			switch (qcomp) {
				case "select": // 选择组件
					$this.selectpicker("val", "");
					break;
				case "datetime": // 日期组件-毫秒
					$this.datepicker("update", "");
					break;
				case "datestr": // 日期组件-文本
					// $this.datepicker("val", "");
					break;
				default:
					break;
			}
		} else {
			$this.val("");
		}
	});

	obj.find("[id^=btnClear]").each(function() {
		$(this).hide();
	});
}