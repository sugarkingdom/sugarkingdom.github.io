
$(function() {
	$("#regBtn").on("click", regBtnClick);
});

function regBtnClick() {
	if ($("#phone").val() != null && $("#phone").val() != "" && $("#phone").val().length == 11) {
		doAjax("REGISTER.json", {
				phone : $("#phone").val()
			}, {
				successHandler : function(result) {
					if (typeof result.resFlag !== "undefined" && result.resFlag == "N") {
						$.showMessage("恭喜您领取成功！", "info", {
							confirmBtn: $("<button id='confirmBtn'>"),
							confirmHandler: function() {
								doForm("INDEX.do");
							}
						});
					} else {
						$.showMessage(">_<出错请重试...");
					}
				}
			}
		);
	} else {
		$.showMessage("请填写手机号码。");
	}
}