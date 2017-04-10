$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$("#product_type_"+urlGet['type']).show();
		$(".product_list_head_"+urlGet['type']).show();
		$("#product_type_"+urlGet['type']).addClass('no_border_top');
	} else {
		$(".product_item").show();
		$(".product_list_head_00000").show();
		$("#product_type_00001").addClass('no_border_top');
	}


	var searchParam = {
		pageIndex: 0,
		pageSize: 9999
	};
	if (typeof urlGet['type'] !== "undefined") {
		// searchParam.type = urlGet['type'];
	}

	var setProductData = function(listData) {
		var productStr = "";
		var productList = listData.list;
		if (productList.length > 0) {
			for (var i in productList) {
				var data = productList[i];
				productStr =
					'<div class="col-xs-4 col-sm-3">' +
					'	<a href="product.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.listImgPath+'"></a>' +
					'	<div class="product_item_code">'+data.name+'</div>' +
					'</div>';
				$("#product_data_"+data.type).append(productStr);
				productStr = "";
			}
		}
	}
	var setFilterData = function(listData) {
		var filterStr = "";
		var filterList = listData.list;
		if (filterList.length > 0) {
			for (var i in filterList) {
				var data = filterList[i];
				filterStr =
					'<div class="col-xs-4 col-sm-3">' +
					'	<a href="filter.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.listImgPath+'"></a>' +
					'	<div class="product_item_code">'+data.name+'</div>' +
					'</div>';
				$("#product_data_filter_element").append(filterStr);
				filterStr = "";
			}
		}
	}
	var searchHandler = function() {
		$(".product_list").empty();
		$.py.ajax("product/getproductlistnl", searchParam, {
			success: function(data) {
				if(data.status == 1) {
					setProductData(data.result);
				}
			}
		});
		$.py.ajax("filterelement/getfilterelementlistnl", searchParam, {
			success: function(data) {
				if(data.status == 1) {
					setFilterData(data.result);
				}
			}
		});
	}
	searchHandler();
});