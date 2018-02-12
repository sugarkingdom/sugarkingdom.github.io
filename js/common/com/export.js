function doExport(url, data) {
	var $iframe = $("#down-file-iframe");
	// 创建iframe
	if ($iframe.length == 0) {
		$iframe = $('<iframe name="down-file-iframe" id="down-file-iframe" style="display:none"/>').appendTo("body");
	}
	// 创建Form
	var $form = $('<form target="down-file-iframe"></form>');
	// 设置属性
	$form.attr("style", "display:none");
	$form.attr('action', url);
	$form.attr('method', 'post');

	var $input = $('<input type="hidden" name="data"/>');
	$input.attr("value", JSON.stringify(data));
	$form.append($input);

	$iframe.append($form);

	$form.submit();

	return false;
}