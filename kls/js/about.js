$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$(".about_container_"+urlGet['type']).show();
	} else {
		$(".about_container_00000").show();
	}
});