var page = 1;
var size = '5';

$(function() {
	var urlGet = $.urlGet();

	var searchParam = {
		pageIndex: (page - 1) * size,
		pageSize: size
	};
	if (typeof urlGet['type'] !== "undefined") {
		// searchParam.type = urlGet['type'];
	}

	var setData = function(listData) {
		var newsStr = "";
		var newsList = listData.list;
		if (newsList.length > 0) {
			for (var i in newsList) {
				var data = newsList[i];
				newsStr +=
					'<div class="col-xs-12 news_item">' +
					'	<div class="col-xs-4 col-sm-3 text-center news_thumb">' +
					'		<a href="news.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
					'		<div class="news_tag">' +
					'			<span>['+data.typeName+']</span>' +
					'		</div>' +
					'		<div class="news_date">'+data.showTimeFmtYyyymmdd+'</div>' +
					'	</div>' +
					'	<div class="col-xs-8 col-sm-9 text-left news_text">' +
					'		<div class="row news_tag">' +
					'			<span>['+data.typeName+']</span>' +
					'		</div>' +
					'		<div class="row news_info">' +
					'			<div class="col-xs-12 col-sm-2 news_date">'+data.showTimeFmtYyyymmdd+'</div>' +
					'			<div class="col-xs-12 col-sm-10">' +
					'				<div class="news_title"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
					'				<br/>' +
					'				<div class="news_intro">'+data.summary+'</div>' +
					'			</div>' +
					'		</div>' +
					'	</div>' +
					'</div>';
			}
			$(".news_list").append(newsStr);
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
		$(".news_list").empty();
		$.py.ajax("articlemodel/getnewslistnl", searchParam, {
			success: function(data) {
				if(data.status == 1) {
					setData(data.result);
				}
			}
		});
	}
	searchHandler();
});