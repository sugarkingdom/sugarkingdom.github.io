var page = '1';
var size = '5';

$(function() {
	var urlGet = $.urlGet();

	var searchParam = {
		pageIndex: (page - 1) * size,
		pageSize: size
	};
	if (typeof urlGet['type'] !== "undefined") {
		searchParam.type = urlGet['type'];
	}

	var setData = function(listData) {
		var newsStr = "";
		var newsList = listData.list;
		if (newsList.length > 0) {
			for (var i in newsList) {
				var data = newsList[i];
				if (i == 0) {
					newsStr =
						'<div class="col-xs-12 col-sm-9">' +
						'	<div class="col-xs-12 lifestyle_item lifestyle_thumb_l">' +
						'		<div class="col-xs-12 col-sm-5 lifestyle_img">' +
						'			<a href="lifestyle.html?id='+data.id+'""><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
						'			<div class="lifestyle_tag">'+data.typeName+'</div>' +
						'		</div>' +
						'		<div class="col-xs-12 col-sm-7 lifestyle_text">' +
						'			<div class="lifestyle_tag">['+data.typeName+']</div>' +
						'			<div class="lifestyle_title_l"><a href="lifestyle.html?id='+data.id+'">'+data.title+'</a></div>' +
						'			<div class="lifestyle_intro_l">'+data.summary+'</div>' +
						'		</div>' +
						'	</div>' +
						'</div>' +
						'<div class="col-xs-12 col-sm-3 text-center qrcode_item">' +
						'	<div class="col-xs-12 lifestyle_item lifestyle_thumb_l">' +
						'		<img class="qrcode" src="img/qrcode.jpg">' +
						'		<div class="qrcode_text">可菱水官方微信</div>' +
						'	</div>' +
						'</div>';
					$("#lifestyle_0").append(newsStr);
					newsStr = "";
				} else if (i >= 1) {
					newsStr +=
						'<div class="col-xs-12 col-sm-3">' +
						'	<div class="col-xs-12 lifestyle_item lifestyle_thumb_s">' +
						'		<div class="col-xs-12 text-center lifestyle_img">' +
						'			<a href="lifestyle.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
						'			<div class="lifestyle_tag">'+data.typeName+'</div>' +
						'		</div>' +
						'		<div class="col-xs-12 lifestyle_text">' +
						'			<div class="lifestyle_tag">['+data.typeName+']</div>' +
						'			<div class="lifestyle_title_s"><a href="lifestyle.html?id='+data.id+'">'+data.title+'</a></div>' +
						'			<div class="lifestyle_intro_s">'+data.summary+'</div>' +
						'		</div>' +
						'	</div>' +
						'</div>';
				}
			}
			$("#lifestyle_1_8").append(newsStr);
		}
		$("#page").showPage({
			page: page,
			pageSet: 2,
			totalPage: listData.count / size,
			onPage: function(event) {
				page = event.data.page;
				searchParam = {
					pageIndex: (page - 1) * size,
					pageSize: size
				};
				searchHandler();
			}
		});
	}
	var searchHandler = function() {
		$(".lifestyle_data").empty();
		$.py.ajax("articlemodel/getelegantlivinglistnl", searchParam, {
			success: function(data) {
				if(data.status == 1) {
					setData(data.result);
				}
			}
		});
	}
	// searchHandler();
});