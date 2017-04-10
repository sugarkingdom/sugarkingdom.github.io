(function($) {
	$.showMessage = function(info, mode, option) {
		option = option || {};
		info = $("<span>").addClass("popup-info-text").html(info);
		$.messageBox.html(info);
		if (typeof mode === "undefined" || mode == "info") {
			setTimeout(function() {
				$.messageBox.removeClass("popup-show");
				if (typeof option.confirmHandler !== "undefined") {
					option.confirmHandler.call(this);
				}
			}, 2000);
		} else if (typeof mode !== "undefined" && mode == "message") {
			$.messageBox.addClass("popup-message");
			info.addClass("popup-message-text");
			$.messageBox.append(option.confirmBtn.addClass("popup-message-btn").html("确定"));
		} else if (typeof mode !== "undefined" && mode == "confirm") {
			$.messageBox.addClass("popup-message");
			info.addClass("popup-message-text");
			$.messageBox.append(option.confirmBtn.addClass("popup-confirm-btn1").html("确定"));
			$.messageBox.append(option.cancelBtn.addClass("popup-confirm-btn2").html("取消"));
		}
		$.messageBox.addClass("popup-show");

		if (typeof option.confirmBtn !== "undefined") {
			option.confirmBtn.on("click", function() {
				$.messageBox.removeClass("popup-show");
				if (typeof option.confirmHandler !== "undefined") {
					option.confirmHandler.call(this);
				}
			});
		}
		if (typeof option.cancelBtn !== "undefined") {
			option.cancelBtn.on("click", function() {
				$.messageBox.removeClass("popup-show");
				if (typeof option.cancelHandler !== "undefined") {
					option.cancelHandler.call(this);
				}
			});
		}
	};
})(jQuery);

$(function() {
	$.messageBox = $("<div/>").addClass("popup-info");
	$("body").append($.messageBox);
});