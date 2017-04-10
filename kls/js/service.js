$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$(".service_container_"+urlGet['type']).show();
	} else {
		$(".service_container_00000").show();
	}

	if (typeof urlGet['qa_type'] !== "undefined") {
		$("#qa_nav_"+urlGet['qa_type']).addClass('active');
		$(".qa_type_container_"+urlGet['qa_type']).show();
	} else {
		$("#qa_nav_00001").addClass('active');
		$(".qa_type_container_00001").show();
	}

	// getqalistnl();
});

function getqalistnl() {
	$("#qa_type_container_00001").empty();
	$("#qa_type_container_00002").empty();
	$.py.ajax("qa/getqalistnl", {
		pageIndex: 0,
		pageSize: 9999
	}, {
		success: function(listData) {
			if(listData.status == 1) {
				var qaList = listData.result.list;
				var tempStr = "";
				var qaTypeCountObj = {};
				var qaTypeSubCountObj = {};
				if (qaList.length > 0) {
					for (var i in qaList) {
						var data = qaList[i];

						/*" answer:您好！可菱水净水器有以下5种类型。↵1.滤水杯：无需安装、收纳性强、携带方便↵2.蛇口型：体型小巧、即装即用、快速净水↵3.台上型：简单安装，充沛水量，适合全家人使用↵4.台下型：高性能过滤、充沛水量、造型美观滤芯小巧↵5.商用型：充沛水量，适合酒店、餐厅等使用。当然，如果您家中有一个以上出水口(如双开门冰箱，咖啡机等)，也推荐使用。"
							id:1
							question:"可菱水净水器有哪几种类型？"
							subType:"0000100001"
							subTypeName:"净水器"
							type:"00001"
							typeName:"售前服务"*/

						if (typeof qaTypeCountObj[data.type] === "undefined") {
							qaTypeCountObj[data.type] = 0;
							// 此处可动态生成QA大类
							tempStr = 
								'<ul id="qa_tab_'+data.type+'" class="nav nav-tabs nav-justified qa_tab">' +
								'</ul>' + 
								'<div id="qa_tab_content_'+data.type+'" class="tab-content qa_tab_content">' + 
								'</div>';
							$("#qa_type_container_"+data.type).append(tempStr);
							tempStr = "";
						}
						qaTypeCountObj[data.type]++;

						if (typeof qaTypeSubCountObj[data.subType] === "undefined") {
							qaTypeSubCountObj[data.subType] = 0;
							// 动态生成QA小类
							// 处理Tab头部
							$("#qa_tab_"+data.type).append('<li><a data-toggle="tab" href="#qa_type_'+data.subType+'">'+data.subTypeName+'</a></li>');

							// 处理Tab内容
							tempStr = 
								'<div id="qa_type_'+data.subType+'" class="tab-pane fade">' +
								'	<div id="qa_tab_item_'+data.subType+'" class="qa_tab_item">' +
								'	</div>' +
								'</div>';
							$("#qa_tab_content_"+data.type).append(tempStr);
							tempStr = "";
						}
						qaTypeSubCountObj[data.subType]++;

						tempStr = 
							'<div class="qa_item">' +
							'	<a class="list-group-item collapsed q_item" data-toggle="collapse" href="#a_'+data.id+'" data-parent="#qa_tab_item_'+data.subType+'">' +
							'		<div class="q_num">Q'+qaTypeSubCountObj[data.subType]+'</div>'+data.question +
							'	</a>' +
							'	<div id="a_'+data.id+'" class="panel-collapse collapse">' +
							'		<div class="a_item">' +
							'			<div class="a_num">A'+qaTypeSubCountObj[data.subType]+'</div>' +
							'			<div class="a_text">'+data.answer.replace("↵", "<br>")+'</div>' +
							'		</div>' +
							'	</div>' +
							'</div>';
						$("#qa_tab_item_"+data.subType).append(tempStr);
						tempStr = "";
					}

					// 处理Tab头部
					$("#qa_tab_00001 li:nth-child(1)").addClass('active');
					$("#qa_tab_00002 li:nth-child(1)").addClass('active');
					$("#qa_tab_content_00001 div:nth-child(1)").addClass('active').addClass('in');
					$("#qa_tab_content_00002 div:nth-child(1)").addClass('active').addClass('in');
				}
			}
		}
	});
}