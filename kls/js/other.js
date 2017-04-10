$(function() {
	var urlGet = $.urlGet();
	if (typeof urlGet['type'] !== "undefined") {
		$(".other_container_"+urlGet['type']).show();
	} else {
		$(".other_container_00000").show();
	}
});