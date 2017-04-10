var page = 1;
var size = 10;

$(function() {
	// $("#result_data").empty();
	// $(".search_result_num").hide();
	var urlGet = $.urlGet();

	if (typeof urlGet['type'] !== "undefined") {
		if (urlGet['type'] == "1") {
			$("#list_nav_00001").addClass('active');
		} else if (urlGet['type'] == "3") {
			$("#list_nav_00002").addClass('active');
		}
		$("#list_nav_"+urlGet['type']).addClass('active');
	} else {
		$("#list_nav_00000").addClass('active');
	}

	var searchParam = {
		pageIndex: (page - 1) * size,
		pageSize: size
	};

	var setData = function(listData) {
		var resultStr = "";
		var list = listData.list;
		$("#result_data").empty();
		$(".search_result_num").show();
		$("#result_num").html(listData.count);
		if (list.length > 0) {
			for (var i in list) {
				var data = list[i];
				if (data.type == "1") {
					resultStr +=
						'<div class="col-xs-12 result_data">' +
						'	<div class="col-xs-2 result_img"><a href="product.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.imgPath+'"></a></div>' +
						'	<div class="col-xs-10 result_text">' +
						'		<div class="product_name">'+data.title+'</div>' +
						'		<div class="product_intro">'+(data.description||'')+'</div>' +
						'		<div class="product_link"><a href="product.html?id='+data.id+'">进一步了解 ></a></div>' +
						'	</div>' +
						'</div>';
				} else if (data.type == "2") {
					resultStr +=
						'<div class="col-xs-12 result_data">' +
						'	<div class="col-xs-2 result_img"><a href="filter.html?id='+data.id+'"><img src="'+PY.uploadPath+'upload/'+data.imgPath+'"></a></div>' +
						'	<div class="col-xs-10 result_text">' +
						'		<div class="product_name">'+data.title+'</div>' +
						'		<div class="product_intro">'+(data.description||'')+'</div>' +
						'		<div class="product_link"><a href="filter.html?id='+data.id+'">进一步了解 ></a></div>' +
						'	</div>' +
						'</div>';
				} else if (data.type == "3") {
					resultStr +=
						'<div class="col-xs-12 result_data">' +
						'	<div class="col-xs-12">' +
						'		<div class="result_title"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
						'		<div class="result_tag">[品牌动态]</div>' +
						'	</div>' +
						'	<div class="col-xs-12">' +
						'		<div class="result_text">'+(data.description||'')+'</div>' +
						'	</div>' +
						'</div>';
				} else if (data.type == "4") {
					resultStr +=
						'<div class="col-xs-12 result_data">' +
						'	<div class="col-xs-12">' +
						'		<div class="result_title"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
						'		<div class="result_tag">[用户支持]</div>' +
						'	</div>' +
						'	<div class="col-xs-12">' +
						'		<div class="result_text">'+(data.description||'')+'</div>' +
						'	</div>' +
						'</div>';
				} else if (data.type == "5") {
					resultStr +=
						'<div class="col-xs-12 result_data">' +
						'	<div class="col-xs-12">' +
						'		<div class="result_title"><a href="news.html?id='+data.id+'">'+data.title+'</a></div>' +
						'		<div class="result_tag">[可菱水生活家]</div>' +
						'	</div>' +
						'	<div class="col-xs-12">' +
						'		<div class="result_text">'+(data.description||'')+'</div>' +
						'	</div>' +
						'</div>';
				}
			}
			$("#result_data").append(resultStr);
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
				if (typeof urlGet['type'] !== "undefined") {
					searchParam.type = urlGet['type'];
				} else {
					searchParam.type = -1;
				}
				if (typeof urlGet['s'] !== "undefined") {
					searchParam.searchText = urlGet['s'];
				}
				searchHandler();
			}
		});
	}
	var searchHandler = function() {
		$.py.ajax("fulltextretrieval/search", searchParam, {
			success: function(data) {
				if(data.status == 1) {
					setData(data.result);
				}
			}
		});
	}

	$("#btnSearch").on('click', function(event) {
		var link = "search.html?";
		if (typeof urlGet['type'] !== "undefined") {
			link += "type=" + urlGet['type'];
		}
		if ($("#searchText").val() !== "") {
			window.location.href = link + "&s=" + $("#searchText").val();
		}
	});

	if (typeof urlGet['s'] !== "undefined") {
		urlGet['s'] = decodeURIComponent(urlGet['s']);
		searchParam.searchText = urlGet['s'];
		$("#list_nav_00000").attr('href', 'search.html?s='+urlGet['s']);
		$("#list_nav_00001").attr('href', 'search.html?type=1&s='+urlGet['s']);
		$("#list_nav_00002").attr('href', 'search.html?type=3&s='+urlGet['s']);
		$("#list_nav_00003").attr('href', 'search.html?type=4&s='+urlGet['s']);
		$("#list_nav_00004").attr('href', 'search.html?type=5&s='+urlGet['s']);
		$("#searchText").val(urlGet['s']);
		if (typeof urlGet['type'] !== "undefined") {
			searchParam.type = urlGet['type'];
		} else {
			searchParam.type = -1;
		}
		// searchHandler();
	}
});