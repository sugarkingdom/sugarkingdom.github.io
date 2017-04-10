$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['id'] !== "undefined") {
		// getarticlemodebyidnl(urlGet['id']);
	}
});

function getarticlemodebyidnl(id) {
	$("#lifestyle_data").empty();
	$.py.ajax("articlemodel/getarticlemodebyidnl", {
		id : id
	}, {
		success : function(data) {
			if (data.status == 1) {
				var lifestyle = data.result.dataObj;
				// console.info(lifestyleList);

				var newsStr = 
					'<div class="row lifestyle_head">' +
					'	<div class="col-xs-12 col-sm-6 text-center lifestyle_img_m">' +
					'		<img src="'+PY.uploadPath+'upload/'+lifestyle.titleImgPath+'">' +
					'		<div class="lifestyle_tag">'+lifestyle.typeName+'</div>' +
					'	</div>' +
					'	<div class="col-xs-12 col-sm-6 lifestyle_info">' +
					'		<div class="lifestyle_title">'+lifestyle.title+'</div>' +
					'		<div class="lifestyle_tag">['+lifestyle.typeName+']</div>' +
					'		<div class="lifestyle_intro">'+lifestyle.summary+'</div>' +
					'		<hr>' +
					'	</div>' +
					'	<div class="col-xs-12 col-sm-6 text-center lifestyle_img"><img src="'+PY.uploadPath+'upload/'+lifestyle.titleImgPath+'"></div>' +
					'	<div class="col-xs-12 lifestyle_pc">' +
					'		<hr>' +
					'	</div>' +
					'</div>' +
					'<div class="row">' +
					'	<div class="col-xs-12 text-center text_content">'+lifestyle.content+'</div>' +
					'</div>';
				$("#lifestyle_data").append(newsStr);
			}
		}
	});
}