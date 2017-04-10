var PY = PY || {};
PY.rootPath = window.location.protocol + "//" + window.location.host + "/kls/";
PY.uploadPath = window.location.protocol + "//" + window.location.host + "/";

(function($) {
	$.extend({
		urlGet : function() {
			var aQuery = window.location.href.split("?"); // 取得Get参数
			var aGET = new Array();
			if (aQuery.length > 1) {
				var aBuf = aQuery[1].split("&");
				for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
					var aTmp = aBuf[i].split("="); // 分离key与Value
					aGET[aTmp[0]] = aTmp[1];
				}
			}
			return aGET;
		},
		getFormData : function(form) {
			var formData = form.serializeArray().reduce(function(obj, item) {
				obj[item.name] = item.value;
				return obj;
			}, {});
			return formData;
		}
	});

	$.py = {
		ajax : function(url, param, option) {
			if (param != null)
				param = JSON.stringify(param);
			option = option || {};
			$.ajax({
				url : PY.rootPath + 'rest/' + url,
				data : param,
				method : option.method || "post",
				async : option.async || true,
				dataType : option.dataType || "json",
				contentType : option.contentType || "application/json",
				success : function(result, status, xhr) {
					if (xhr.status == 200) {
						if (result.status == 2) {
							window.location.href = PY.rootPath + "admin/login.html";
						} else if (typeof option.success !== "undefined") {
							option.success.call(this, result, status, xhr)
						}
					}
				}
			});
		},
		/**
		 * 取得字符长度
		 * 
		 * @param str
		 * @returns
		 */
		getStrLength: function (str) {
			var cArr = str.match(/[^\x00-\xff]/ig);
			return str.length + (cArr == null ? 0 : cArr.length);
		},
		validateNull: function(dom) {
			var flag = true, equiredDoms = $(".required"), domTagName = null;
			if(dom != null && typeof dom !== "undefined") {
				equiredDoms = dom.find(".required");
			} 
			equiredDoms.each(function() {
				domTagName = $(this)[0].tagName;
				switch (domTagName) {
				case "INPUT":
					if($(this).val().trim() == "") {
						flag = false;
						showInfo(false, $(this).attr("requiredName") + "不能为空");
						return flag;
					}
				}
			});
			return flag;
		}
	};
})(jQuery);


$(function() {
	var headerStr = 
		'<nav class="navbar header">' +
		'	<div class="container nav_container">' +
		'		<div class="navbar-header">' +
		'			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">' +
		'			<span class="sr-only">Toggle navigation</span>' +
		'			<span class="icon-bar"></span>' +
		'			<span class="icon-bar"></span>' +
		'			<span class="icon-bar"></span>' +
		'			</button>' +
		'			<a class="navbar-brand logo" href="index.html"><img src="http://placehold.it/200x68"></a>' +
		'		</div>' +
		'		<div id="company_logo">' +
		'			<img src="img/company.png">' +
		'		</div>' +
		'		<div id="navbar" class="navbar-collapse collapse">' +
		'			<ul id="menu" class="nav navbar-nav navbar-right">' +
		'			<li><a href="about.html">关于可菱水</a></li>' +
		'			<li><a href="product_list.html">产品信息</a></li>' +
		'			<li><a href="news_list.html">品牌动态</a></li>' +
		'			<li><a href="find.html">店铺信息</a></li>' +
		'			<li><a href="service.html">用户支持</a></li>' +
		'			<li><a href="lifestyle_list.html">可菱水生活家</a></li>' +
		'			<li><a style="border: 0;" href="http://cleansui.jd.com" target="_blank">在线商城</a></li>' +
		'			<li><a class="maBtn">可菱水官方微信公众号</a></li>' +
		// '			<li><a class="header_icon" href="search.html"><img src="img/search.png"></a></li>' +
		'			<li><a class="header_icon">' +
		'				<div id="hSearch">' +
		'					<form action="search.html?s=" id="headerSearch" method="get">' +
		'						<h1>产品搜索</h1>' +
		'						<div class="wrapper">' +
		'							<div class="cancel"></div>' +
		'							<input type="search" placeholder="搜索" name="s" value="">' +
		'						</div>' +
		'					</form>' +
		'				</div>' +
		'			</a></li>' +
		'			<li><a class="header_icon" href="service.html?type=00003"><img src="img/weixin.png"></a></li>' +
		'			</ul>' +
		'		</div>' +
		'	</div>' +
		'</nav>';
	$("#header").empty();
	$("#header").append(headerStr);

	var footerStr = 
		'<div class="container">' +
		'	<div class="row">' +
		'		<div class="col-xs-12 col-sm-9 footer_row footer_left text-left">' +
		'			<div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="about.html">关于可菱水</a></li>' +
		'					<li><a href="about.html?type=00000">品牌</a></li>' +
		'					<li><a href="about.html?type=00001">技术</a></li>' +
		'					<li><a href="about.html?type=00002">企业</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="product_list.html">产品信息</a></li>' +
		'					<li><a href="product_list.html?type=00001">台下型净水器</a></li>' +
		'					<li><a href="product_list.html?type=00002">台上型净水器</a></li>' +
		'					<li><a href="product_list.html?type=00003">蛇口型净水器</a></li>' +
		'					<li><a href="product_list.html?type=00004">滤水杯</a></li>' +
		'					<li><a href="product_list.html?type=00006">商用型净水器</a></li>' +
		'					<li><a href="product_list.html?type=00007">滤芯</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="news_list.html">品牌动态</a></li>' +
		'					<li><a href="news_list.html?type=00001">公告</a></li>' +
		'					<li><a href="news_list.html?type=00002">展会资讯</a></li>' +
		'					<li><a href="news_list.html?type=00003">产品资讯</a></li>' +
		'					<li><a href="news_list.html?type=00004">活动资讯</a></li>' +
		'					<li><a href="news_list.html?type=00005">其他</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="find.html">店铺信息</a></li>' +
		'					<li><a href="find.html">店铺查询</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="service.html">用户支持</a></li>' +
		'					<li><a href="service.html?type=00000">常见问题</a></li>' +
		'					<li><a href="service.html?type=00001">配件安装指导</a></li>' +
		'					<li><a href="service.html?type=00002">产品手册下载</a></li>' +
		'					<li><a href="service.html?type=00003">微信服务</a></li>' +
		'					<li><a href="service.html?type=00004">防伪说明</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="http://cleansui.jd.com" target="_blank">在线商城</a></li>' +
		// '					<li>天猫旗舰店</li>' +
		'					<li><a href="http://cleansui.jd.com" target="_blank">京东旗舰店</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="other.html">其他</a></li>' +
		'					<li><a href="other.html?type=00000">隐私政策</a></li>' +
		'					<li><a href="other.html?type=00001">网站地图</a></li>' +
		'					<li><a href="other.html?type=00002">网站使用条例</a></li>' +
		'				</ul>' +
		'			</div><div class="footer_item_2">' +
		'				<ul>' +
		'					<li class="footer_title"><a href="lifestyle_list.html">可菱水生活家</a></li>' +
		'				</ul>' +
		'			</div>' +
		'		</div>' +
		'		<div class="col-xs-12 col-sm-3 footer_row footer_right text-left">' +
		'			<div class="row">' +
		'				<ul>' +
		'					<li class="footer_title">可菱水客户服务中心</li>' +
		'					<li>服务热线：4008-155-511</li>' +
		'					<li>SC专线：021-62220858</li>' +
		'					<li>(周一～周五 9:00-17:00节假日除外)</li>' +
		'					<li><a class="maBtn"><img class="link_icon_3" src="img/weixin_alter.png">可菱水官方微信公众号</a></li>' +
		'				</ul>' +
		'			</div>' +
		'			<div class="row contact_icon">' +
		'				<div class="contact_icon_item">' +
		'					<a class="wx" href="service.html?type=00003"><img src="img/weixin_icon.png"></a>' +
		'				</div><div class="contact_icon_item">' +
		'					<a href="http://cleansui.jd.com" target="_blank"><img src="img/jd_icon.png"></a>' +
		'				</div>' +
		// '				<div class="wx-qrcode" style="display: none;">' +
		// '					<img src="img/qrcode_alter.jpg">' +
		// '				</div>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'	<div class="row">' +
		'		<div class="col-xs-12 text-left bottom_row link_row">' +
		'			<div>' +
		'				<ul>' +
		'					<li class="link_span">友情链接</li>' +
		'					<li class="link_span_1"><a href="http://www.mitsubishichem-hd.co.jp/chinese/"><img class="link_icon_1" src="img/mitsubishi_icon.png">三菱化学控股集团</a></li>' +
		'					<li class="link_span_1"><a href="http://www.mitsubishichem-hd-china.com/">三菱化学控股管理（北京）有限公司</a></li>' +
		'					<li class="link_span_2"><a href="http://www.cleansui.com/index.html"><img class="link_icon_2" src="img/logo.png">三菱化学可菱水（日本官网）</a></li>' +
		'				</ul>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'	<div class="row">' +
		'		<div class="col-xs-12 text-left bottom_row icp_row">' +
		'			<div>' +
		'				<ul>' +
		'					<li>Copyright &copy;' +
		'					<li>Mitsubishi Chemical Cleansui Co., Ltd. All Rights Reserved.</li>' +
		'					<li><img class="icp_icon" src="img/icp_icon.png">沪ICP备07506593号</li>' +
		'				</ul>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'</div>';
	$("#footer").empty();
	$("#footer").append(footerStr);

	var maStr = 
		'<div class="maBox" style="display: none;">' +
		'	<img src="img/qrcode_alter.jpg" width="100" style="display: none;">' +
		'</div>';
	$("body").append(maStr);

	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$("#list_nav_"+urlGet['type']).addClass('active');
	} else {
		$("#list_nav_00000").addClass('active');
	}

	var headerResizeFun = function() {
		if ($(document).width() > 768) {
			$(".navbar").removeClass('navbar-fixed-top').addClass('navbar-default');
		} else {
			$(".navbar").addClass('navbar-fixed-top').removeClass('navbar-default');
		}
	};
	
	window.onresize = headerResizeFun;
	headerResizeFun();

	//二维码
	$('.maBox').on('click', function(){
		$(this).find("img").hide();
		$(this).fadeOut();
	});
	$('.maBtn').on('click', function(){
		$('.maBox').fadeIn();
		$('.maBox img').fadeIn();
	});

	// $(".wx").hover(function(){
	// 	$(".wx-qrcode").stop(true,true).fadeIn(300);
	// },function(){
	// 	$(".wx-qrcode").stop(true,true).fadeOut(300);
	// });

	$("#hSearch h1").on("click", function(){
		$("#hSearch .wrapper").show();
		$("#hSearch input[type='search']").focus();
		$("#main, #hGlobalNav h1, #siteName img, #hSearch h1").addClass("blur");
	});
	$("#hSearch .cancel").on("click", function(e){
		$("#hSearch .wrapper").hide();
		$("#main, #hGlobalNav h1, #siteName img, #hSearch h1").removeClass("blur");
	});
});