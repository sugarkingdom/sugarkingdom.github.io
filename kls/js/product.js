$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$(".list_nav a").hide();
		$("#list_nav_"+urlGet['type']).addClass('active');
		$("#list_nav_"+urlGet['type']).show();
		$(".list_nav").show();
	}
	if (typeof urlGet['id'] !== "undefined") {
		// getproductbyidnl(urlGet['id']);
	}
});

function getproductbyidnl(id) {
	$("#product_name").empty();
	$("#product_img").empty();
	$("#product_feature").empty();
	$("#product_feature_img").empty();
	$("#product_target").empty();
	$("#product_target_img").empty();
	$("#product_related").empty();
	$("#product_related_img").empty();
	$("#product_service_row").empty();
	$.py.ajax("product/getproductbyidnl", {
		id : id
	}, {
		success : function(data) {
			if (data.status == 1) {
				var product = data.result.dataObj;
				$(".list_nav a").hide();
				$("#list_nav_"+product.type).addClass('active');
				$("#list_nav_"+product.type).show();
				$(".list_nav").show();
				$("#product_name").append('> '+product.name);
				$("#product_img").append('<img src="'+PY.uploadPath+'upload/'+product.detailImgPath+'">');

				var serviceStr = "";
				if (product.hasFilterElement == "1") {
					serviceStr +=
						'<div class="col-xs-3 service_row_item">' +
						'	<div class="col-xs-12 col-sm-4">' +
						'		<div class="service_icon"><a href="filter.html?id='+product.filterElementId+'"><img src="img/product_support1.png"></a></div>' +
						'	</div>' +
						'	<div class="col-xs-12 col-sm-8 serivce_row_span">' +
						'		<span class="service_span_cn"><a href="filter.html?id='+product.filterElementId+'">适配滤芯</a></span><br/>' +
						'		<span class="service_span_en"><a href="filter.html?id='+product.filterElementId+'">立即前往 ></a></span>' +
						'	</div>' +
						'</div>';
				}
				// if (product.hasTmall == "1") {
				// 	serviceStr +=
				// 		'<div class="col-xs-3 service_row_item">' +
				// 		'	<div class="col-xs-12 col-sm-4">' +
				// 		'		<div class="service_icon"><a href="http://cleansui.tmall.com" target="_blank"><img src="img/product_support2.png"></a></div>' +
				// 		'	</div>' +
				// 		'	<div class="col-xs-12 col-sm-8 serivce_row_span">' +
				// 		'		<span class="service_span_cn"><a href="http://cleansui.tmall.com" target="_blank">天猫</a></span><br/>' +
				// 		'		<span class="service_span_en"><a href="http://cleansui.tmall.com" target="_blank">立即前往 ></a></span>' +
				// 		'	</div>' +
				// 		'</div>';
				// }
				if (product.hasJd == "1") {
					serviceStr +=
						'<div class="col-xs-3 service_row_item">' +
						'	<div class="col-xs-12 col-sm-4">' +
						'		<div class="service_icon"><a href="http://cleansui.jd.com" target="_blank"><img src="img/product_support3.png"></a></div>' +
						'	</div>' +
						'	<div class="col-xs-12 col-sm-8 serivce_row_span">' +
						'		<span class="service_span_cn"><a href="http://cleansui.jd.com" target="_blank">京东</a></span><br/>' +
						'		<span class="service_span_en"><a href="http://cleansui.jd.com" target="_blank">立即前往 ></a></span>' +
						'	</div>' +
						'</div>';
				}
				if (product.hasAgency == "1") {
					serviceStr +=
						'<div class="col-xs-3 service_row_item">' +
						'	<div class="col-xs-12 col-sm-4">' +
						'		<div class="service_icon"><a href="find.html"><img src="img/product_support4.png"></a></div>' +
						'	</div>' +
						'	<div class="col-xs-12 col-sm-8 serivce_row_span">' +
						'		<span class="service_span_cn"><a href="find.html">店铺查询</a></span><br/>' +
						'		<span class="service_span_en"><a href="find.html">立即前往 ></a></span>' +
						'	</div>' +
						'</div>';
				}
				$("#product_service_row").append(serviceStr);

				var featureList = data.result.featureList;
				var featureStr = '<div class="product_feature_title">产品特点</div>';
				if (featureList.length > 0) {
					for (var i in featureList) {
						var feature = featureList[i];
						featureStr += '<div class="product_feature_item">'+feature.name+'</div>';
					}
					$("#product_feature").append(featureStr);
				}

				var featureImgList = data.result.featureImgList;
				var featureImgStr = "";
				if (featureImgList.length > 0) {
					for (var i in featureImgList) {
						var featureImg = featureImgList[i];
						featureImgStr += '<div class="item"><a><img src="'+PY.uploadPath+'upload/'+featureImg.imgPath+'"></a></div>'
					}
					$("#product_feature_img").append(featureImgStr);
					$("#product_feature_img div:nth-child(1)").addClass('active');
				}

				var targetList = data.result.targetList;
				var targetStr = '<div class="product_feature_title">推荐人群</div>';
				if (targetList.length > 0) {
					for (var i in targetList) {
						var feature = targetList[i];
						targetStr += '<div class="product_feature_item">'+feature.name+'</div>';
					}
					$("#product_target").append(targetStr);
				}

				var targetImgList = data.result.targetImgList;
				var targetImgStr = "";
				if (targetImgList.length > 0) {
					for (var i in targetImgList) {
						var targetImg = targetImgList[i];
						targetImgStr += '<div class="item"><a><img src="'+PY.uploadPath+'upload/'+targetImg.imgPath+'"></a></div>'
					}
					$("#product_target_img").append(targetImgStr);
					$("#product_target_img div:nth-child(1)").addClass('active');
				}

				var relatedList = data.result.relatedList;
				var relatedStr = '<div class="product_feature_title">相关信息</div>';
				if (relatedList.length > 0) {
					for (var i in relatedList) {
						var feature = relatedList[i];
						relatedStr += '<div class="product_feature_item">'+feature.name+'</div>';
					}
					$("#product_related").append(relatedStr);
				}

				var relatedImgList = data.result.relatedImgList;
				var relatedImgStr = "";
				if (relatedImgList.length > 0) {
					for (var i in relatedImgList) {
						var relatedImg = relatedImgList[i];
						relatedImgStr += '<div class="item"><a><img src="'+PY.uploadPath+'upload/'+relatedImg.imgPath+'"></a></div>'
					}
					$("#product_related_img").append(relatedImgStr);
					$("#product_related_img div:nth-child(1)").addClass('active');
				}

				// console.info(lifestyleList);
			}
		}
	});
}