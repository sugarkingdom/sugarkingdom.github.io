var data_list = [{Address:"上海市浦东新区张扬路501号八佰伴7楼",
Latitude:31.233389,
Longitude:121.523819,
Name:"第一八佰伴",
flag:"1",
phone:"021-58360000"},
{Address:"上海市黄浦区南京东路830号第一百货8楼",
Latitude:31.240786,
Longitude:121.481302,
Name:"第一百货商店 ",
flag:"1",
phone:"021-63223344"},
{Address:"上海市徐汇区漕溪路8号东方商厦5楼",
Latitude:31.1997,
Longitude:121.44416,
Name:"东方商厦（徐汇店）",
flag:"1",
phone:"021-64874468"},
{Address:"上海市杨区五角场四平路2500号B1层",
Latitude:31.304394,
Longitude:121.5223,
Name:"东方商厦（杨浦店）",
flag:"1",
phone:"021-55053888"},
{Address:"上海市静安区南京西路1618号7楼",
Latitude:31.229858,
Longitude:121.453022,
Name:"上海久光百货",
flag:"1",
phone:"021-32174838"},
{Address:"上海市徐汇区淮海中路999号地下2楼",
Latitude:31.221212,
Longitude:121.465423,
Name:"City Super超生活(AMP环贸广场店)",
flag:"1",
phone:"无"},
{Address:"上海长宁区仙霞西路88号百联西郊购物中心地下二层",
Latitude:31.214342,
Longitude:121.376038,
Name:"HOLA特力屋（上海仙霞店）",
flag:"1",
phone:"021-52191919-613"},
{Address:"上海市杨浦区政通路189号万达广场3楼",
Latitude:31.308421,
Longitude:121.519906,
Name:"HOLA特力屋（上海五角场店）",
flag:"1",
phone:"021-65111888"},
{Address:"上海市浦东新区世纪大道8号国金中心地下1楼",
Latitude:31.241551,
Longitude:121.507641,
Name:"City Super超生活(国金店)",
flag:"0",
phone:"无"},
{Address:"上海普陀区真光路1288号3F 百联中环购物中心三楼",
Latitude:31.251716,
Longitude:121.38935,
Name:"HOLA特力屋（上海百联中环店）",
flag:"1",
phone:"021-52788686"},
{Address:"南京东路800号近西藏中路8楼",
Latitude:31.242711,
Longitude:121.480437,
Name:"东方商厦(南京东路店)",
flag:"1",
phone:"021-63223344"},
{Address:"上海市浦东新金桥路28号新金桥大厦GF",
Latitude:31.251744,
Longitude:121.598061,
Name:"爱泊满（贸易）",
flag:"0",
phone:"无"}];

var map;
$(function() {

	// locationNetworkSet();

	// provinceFun();
	// $("#provinceCode").on('change', function(event) {
	// 	cityFun($("#provinceCode").selectpicker('val'));
	// });
	// $("#cityCode").on('change', function(event) {
	// 	networkDataSet($("#provinceCode").selectpicker('val'), $("#cityCode").selectpicker('val'));
	// });

	// newmap();

	// $('.find_network').enscroll({
	// 	showOnHover: false,
	// 	verticalTrackClass: 'track3',
	// 	verticalHandleClass: 'handle3'
	// });
});

function locationNetworkSet() {
	$("#network_list").empty();
	function myFun(result){
		var cityName = result.name;
		map.setCenter(cityName);
		$.py.ajax("city/getcitybycitynamenl", {
			cityName: cityName
		}, {
			success : function(data) {
				if (data.status == 1) {
					var city = data.result.city;
					if (typeof city !== "undefined") {
						networkDataSet(city.provinceCode, city.code);
						provinceFun(city.provinceCode);
					}
				}
			}
		});
	}
	var myCity = new BMap.LocalCity();
	myCity.get(myFun);
}

function provinceFun(provinceCode) {
	$.py.ajax("network/getvalidprovince", {}, {
		success : function(data) {
			if (data.status == 1) {
				var list = data.result.list;
				for (var i in list) {
					var data = list[i];
					$("#provinceCode").append('<option value="'+data.code+'">'+data.name+'</option>');
				}
				$("#provinceCode").selectpicker({});
				$("#provinceCode").selectpicker('val', provinceCode);
			}
			cityFun(provinceCode);
		}
	});
}

function cityFun(provinceCode) {
	$('#cityCode').selectpicker('destroy');
	$("#cityCode").empty();
	$.py.ajax("network/getvalidcitiesbyprovincecode", {
		provinceCode: provinceCode
	}, {
		success : function(data) {
			if (data.status == 1) {
				var list = data.result.list;
				// $("#cityCode").append('<option value=""></option>');
				for (var i in list) {
					var data = list[i];
					$("#cityCode").append('<option value="'+data.code+'">'+data.name+'</option>');
				}
				$("#cityCode").selectpicker({});
				networkDataSet($("#provinceCode").selectpicker('val'));
			}
		}
	});
}

function newmap(){
	map = new BMap.Map("allmap");
	// map.centerAndZoom("上海", 12); // 初始化地图,设置中心点坐标和地图级别
	//添加缩略地图控件
	map.enableScrollWheelZoom();	//启用滚轮放大缩小
}

function networkDataSet(provinceCode, cityCode) {
	// var myCity = new BMap.LocalCity();
	// myCity.get(myFun);
	map.clearOverlays();
	$("#network_list").empty();
	$.py.ajax("network/getnetworksbyparams", {
		provinceCode: provinceCode,
		cityCode: cityCode
	}, {
		success : function(data) {
			if (data.status == 1) {
				var list = data.result.networks;
				if (list.length > 0) {
					for (var i = 0; i < list.length; i++) {
						var data = list[i];
						addMarker(data, i+1);
					}
					setTimeout(function(){
						map.centerAndZoom(new BMap.Point(list[0].latitude, list[0].longitude), 12);  
					}, 200);
				}
			}
		}
	});
}

function addMarker(data, i){
	var point = new BMap.Point(data.latitude, data.longitude);
	var myIcon = new BMap.Icon("img/map_marker.png",   
		new BMap.Size(25, 25), {
		anchor: new BMap.Size(8, 0),
	});

	var networkStr = 
		'<a id="n_'+i+'" class="list-group-item find_network_item">' +
		'	<div class="row">' +
		'		<div class="col-xs-2 text-center">' +
		'			<div class="find_network_num">'+i+'</div>' +
		'		</div>' +
		'		<div class="col-xs-10">' +
		'			<div class="find_network_name">'+data.name+'</div>' +
		'			<div class="find_network_addr">'+data.address+'</div>' +
		'			<div class="find_network_tel">'+data.tel+'</div>' +
		'		</div>' +
		'	</div>' +
		'</a>';
	$("#network_list").append(networkStr);

	var searchInfoWindow = null;
	var content = 
		'<div class="row find_network_window">' +
		'	<div class="col-xs-2 network_icon">' +
		'		<img id="network_icon" src="img/network_icon.png">' +
		'	</div>' +
		'	<div class="col-xs-10 network_text">' +
		'		<div class="network_name">'+data.name+'</div>' +
		'		<div class="network_addr">'+data.address+'</div>' +
		'		<div class="network_tel">'+data.tel+'</div>' +
		'	</div>' +
		'</div>';
	searchInfoWindow = new BMap.InfoWindow(content);
	var marker = new BMap.Marker(point, {icon:myIcon});
	marker.addEventListener("click", function(e){
		map.openInfoWindow(searchInfoWindow,point);
		document.getElementById('network_icon').onload = function (){
			searchInfoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
		}
		$(".find_network_item").removeClass('active');
		$("#n_"+i).addClass('active');
	})
	$("#n_"+i).on("click", function(e){
		map.centerAndZoom(new BMap.Point(data.latitude, data.longitude), 12); 
		map.openInfoWindow(searchInfoWindow,point);
		document.getElementById('network_icon').onload = function (){
			searchInfoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
		}
		$(".find_network_item").removeClass('active');
		$("#n_"+i).addClass('active');
	});
	map.addOverlay(marker);
	var opts = {};
	if (i >= 10) {
		opts = {offset: new BMap.Size(5,2)};
	} else {
		opts = {offset: new BMap.Size(8,2)};
	}
	var label = new BMap.Label(i,opts);
	marker.setLabel(label);
}