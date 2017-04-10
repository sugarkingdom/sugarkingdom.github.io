$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['id'] !== "undefined") {
		// getarticlemodebyidnl(urlGet['id']);
	}
});

function getarticlemodebyidnl(id) {
	$("#news_data").empty();
	$.py.ajax("articlemodel/getarticlemodebyidnl", {
		id : id
	}, {
		success : function(data) {
			if (data.status == 1) {
				var news = data.result.dataObj;
				// console.info(lifestyleList);

				var newsStr = 
					'<div class="row">' +
					'	<div class="col-xs-12 text-center news_title">' +
					'		<span>'+news.title+'</span>' +
					'	</div>' +
					'	<div class="col-xs-12 text-center news_info">' +
					'		<span class="news_date">'+news.showTimeFmtYyyymmdd+'</span>' +
					'		<span class="news_tag">'+news.typeName+'</span>' +
					'	</div>' +
					'</div>' +
					'<div class="row">' +
					'	<div class="col-xs-12 text-center news_title_img">' +
					'		<img src="'+PY.uploadPath+'upload/'+news.titleImgPath+'">' +
					'	</div>' +
					'	<div class="col-xs-12 news_hr">' +
					'		<hr>' +
					'	</div>' +
					'</div>' +
					'<div class="row">' +
					'	<div class="col-xs-12 text-center text_content">'+news.content+'</div>' +
					'</div>';
				$("#news_data").append(newsStr);
			}
		}
	});
}