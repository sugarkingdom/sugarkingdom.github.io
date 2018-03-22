var wlh = window.location.protocol + "//" + window.location.host;
var P = {
	rootPath: wlh + "/",
	uploadImgPath: wlh + "/upload/",
	includeCSS: function(path) {
		document.write('<link rel="stylesheet" href="' + P.rootPath + path + '" type="text/css"/>');
	},
	includeJS: function(path) {
		document.write('<script type="text/javascript" src="' + P.rootPath + path + '"></script>');
	}
};

P.includeJS("js/generator/generator_jquery.js");
P.includeJS("js/generator/generator_bootstrap_3.js");
P.includeJS("js/generator/generator_bootstrap_fileinput.js");
// P.includeJS("js/generator/generator_bootstrap_summernote.js");
P.includeJS("js/generator/generator_bootstrap_validator.js");
// P.includeJS("js/generator/generator_bootstrap_treeview.js");
// P.includeJS("js/generator/generator_bootstrap_table.js");
P.includeJS("js/generator/generator_bootstrap_bootbox.js");
P.includeJS("js/generator/generator_bootstrap_datepicker.js");
P.includeJS("js/generator/generator_bootstrap_select.js");
P.includeJS("js/generator/generator_font_awesome.js");
// P.includeJS("js/generator/generator_datepicker.js");
P.includeJS("js/generator/generator_awesome_bootstrap_checkbox.js");
P.includeJS("js/generator/generator_fancybox.js");
P.includeJS("js/generator/generator_accounting.js");
// P.includeJS("js/generator/generator_ckeditor.js");
P.includeJS("js/generator/generator_common.js");

// P.includeCSS("css/main.css");
// P.includeCSS("css/main-ext.css");
P.includeCSS("css/sugarTable.css");