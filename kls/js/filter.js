$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$(".list_nav a").hide();
		$("#list_nav_"+urlGet['type']).addClass('active');
		$("#list_nav_"+urlGet['type']).show();
		$(".list_nav").show();
	}
	$(".list_nav a").hide();
	$("#list_nav_00007").addClass('active');
	$("#list_nav_00007").show();
	$(".list_nav").show();
	if (typeof urlGet['id'] !== "undefined") {
		// getproductbyidnl(urlGet['id']);
	}
});

function getproductbyidnl(id) {
	$("#product_name").empty();
	$("#product_img").empty();
	$("#product_feature").empty();
	$("#product_feature_img").empty();
	$.py.ajax("filterelement/getfilterelementbyidnl", {
		id : id
	}, {
		success : function(data) {
			if (data.status == 1) {
				var product = data.result.dataObj;
				$(".list_nav a").hide();
				$("#list_nav_00007").addClass('active');
				$("#list_nav_00007").show();
				$(".list_nav").show();
				$("#product_name").append('> '+product.name);
				$("#product_img").append('<img src="'+PY.uploadPath+'upload/'+product.detailImgPath+'">');

				// var featureList = data.result.featureList;
				// var featureStr = '<div class="product_feature_title">产品特点</div>';
				// if (featureList.length > 0) {
				// 	for (var i in featureList) {
				// 		var feature = featureList[i];
				// 		featureStr += '<div class="product_feature_item">'+feature.name+'</div>';
				// 	}
				// 	$("#product_feature").append(featureStr);
				// }

				// var featureImgList = data.result.featureImgList;
				// var featureImgStr = "";
				// if (featureImgList.length > 0) {
				// 	for (var i in featureImgList) {
				// 		var featureImg = featureImgList[i];
				// 		featureImgStr += '<div class="item"><a><img src="'+PY.uploadPath+'upload/'+featureImg.imgPath+'"></a></div>'
				// 	}
				// 	$("#product_feature_img").append(featureImgStr);
				// 	$("#product_feature_img div:nth-child(1)").addClass('active');
				// }

				// console.info(lifestyleList);
			}
		}
	});
}