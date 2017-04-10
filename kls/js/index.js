$(function() {
	// getbannerlist();
	// getnewslistnl();
	// getelegantlivinglistnl();
});

function getbannerlist() {
	$("#banner_indicators_pc").empty();
	$("#banner_img_pc").empty();
	$("#banner_indicators_m").empty();
	$("#banner_img_m").empty();
	$.py.ajax("banner/getbannerlist", {
		pageSize: 9999,
		pageIndex: 0
	}, {
		success : function(data) {
			if (data.status == 1) {
				var bannerList = data.result.list;
				var bannerIndStr_pc = "";
				var bannerImgStr_pc = "";
				var bannerIndStr_m = "";
				var bannerImgStr_m = "";
				if (bannerList.length > 0) {
					for (var i in bannerList) {
						var data = bannerList[i];
						bannerIndStr_pc += '<li data-target="#banner_pc" data-slide-to="'+i+'"></li>';
						bannerImgStr_pc += '<div class="item"><a href="#"><img src="'+PY.uploadPath+'upload/'+data.imgPath+'"></a></div>';

						bannerIndStr_m += '<li data-target="#banner_m" data-slide-to="'+i+'"></li>';
						bannerImgStr_m += '<div class="item"><a href="#"><img src="'+PY.uploadPath+'upload/'+data.mobileImgPath+'"></a></div>';
					}
					$("#banner_indicators_pc").append(bannerIndStr_pc);
					$("#banner_img_pc").append(bannerImgStr_pc);
					$("#banner_indicators_pc li:nth-child(1)").attr('class', 'active');
					$("#banner_img_pc div:nth-child(1)").addClass('active');

					$("#banner_indicators_m").append(bannerIndStr_m);
					$("#banner_img_m").append(bannerImgStr_m);
					$("#banner_indicators_m li:nth-child(1)").attr('class', 'active');
					$("#banner_img_m div:nth-child(1)").addClass('active');
				}
				// console.info(bannerList);
			}
		}
	});
}

function getnewslistnl() {
	$(".news_data").empty();
	$.py.ajax("articlemodel/getnewslistnl", {
		pageSize: 8,
		pageIndex: 0
	}, {
		success : function(data) {
			if (data.status == 1) {
				var newsList = data.result.list;
				var newsStr = "";
				if (newsList.length > 0) {
					for (var i in newsList) {
						var data = newsList[i];
						if (i == 0) {
							newsStr =
								'<div class="col-xs-4 col-sm-12 news_pic">' +
								'	<a href="news.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
								'	<i class="new_icon"><img src="img/new_icon.png"></i>' +
								'</div>' +
								'<div class="col-xs-8 col-sm-12 news_item text-left">' +
								'	<div class="news_info">'+data.showTimeFmtYyyymmdd+' | '+data.typeName+'<span class="new_text">NEW!</span> </div>' +
								'	<div class="news_title"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
								'	<div class="news_intro">'+data.summary+'</div>' +
								'</div>';
							$("#news_0").append(newsStr);
							newsStr = "";
						} else if (i == 1) {
							newsStr =
								'<div class="col-xs-4 col-sm-12 news_pic">' +
								'	<a href="news.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
								'	<i class="new_icon"><img src="img/new_icon.png"></i>' +
								'</div>' +
								'<div class="col-xs-8 col-sm-12 news_item text-left">' +
								'	<div class="news_info">'+data.showTimeFmtYyyymmdd+' | '+data.typeName+'<span class="new_text">NEW!</span> </div>' +
								'	<div class="news_intro"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
								'</div>';
							$("#news_1").append(newsStr);
							newsStr = "";
						} else if (i == 2) {
							newsStr =
								'<div class="col-xs-4 col-sm-12 news_pic">' +
								'	<a href="news.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
								'	<i class="new_icon"><img src="img/new_icon.png"></i>' +
								'</div>' +
								'<div class="col-xs-8 col-sm-12 news_item text-left">' +
								'	<div class="news_info">'+data.showTimeFmtYyyymmdd+' | '+data.typeName+'<span class="new_text">NEW!</span> </div>' +
								'	<div class="news_intro"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
								'</div>';
							$("#news_2").append(newsStr);
							newsStr = "";
						} else if (i >= 3) {
							newsStr +=
								'<li><a href="news.html?id='+data.id+'">' +
								'	<div class="news_list_item">' +
								'		<div class="news_list_date">'+data.showTimeFmtYyyymmdd+'</div>' +
								'		<div class="news_list_title">'+data.title+'</div>' +
								'	</div>' +
								'</a></li>';
						}
					}
					$("#news_3_7").append(newsStr);
				}
				// console.info(newsList);
			}
		}
	});
}

function getelegantlivinglistnl() {
	$(".lifestyle_data").empty();
	$.py.ajax("articlemodel/getelegantlivinglistnl", {
		pageSize: 5,
		pageIndex: 0
	}, {
		success : function(data) {
			if (data.status == 1) {
				var lifestyleList = data.result.list;
				var lsStr = "";
				if (lifestyleList.length > 0) {
					for (var i in lifestyleList) {
						var data = lifestyleList[i];
						if (i == 0) {
							lsStr =
								'<div class="col-xs-12 news_pic">' +
								'	<a href="lifestyle.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
								'	<span class="lifestyle_icon">'+data.typeName+'</span>' +
								'</div>' +
								'<div class="lifestyle_type">'+data.typeName+'</div>' +
								'<div class="col-xs-12 news_item text-left">' +
								'	<div class="news_title"><a href="lifestyle.html?id='+data.id+'">'+data.title+'</a></div>' +
								'	<div class="news_intro">'+data.summary+'</div>' +
								'</div>';
							$("#lifestyle_0").append(lsStr);
							lsStr = "";
						} else if (i >= 1) {
							lsStr =
								'<div class="col-xs-12 news_pic">' +
								'	<a href="lifestyle.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.titleImgPath+'"></a>' +
								'	<span class="lifestyle_icon">'+data.typeName+'</span>' +
								'</div>' +
								'<div class="lifestyle_type">'+data.typeName+'</div>' +
								'<div class="col-xs-12 news_item text-left">' +
								'	<div class="news_intro"><a href="lifestyle.html?id='+data.id+'">'+data.title+'</a></div>' +
								'</div>';
							$("#lifestyle_"+i).append(lsStr);
							lsStr = "";
						}
					}
				}
				// console.info(lifestyleList);
			}
		}
	});
}