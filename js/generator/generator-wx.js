var wlh = window.location.protocol + "//" + window.location.host;
var P = {
	rootPath: wlh + "/CarBid/",
	uploadPath: wlh + "/",
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
P.includeJS("js/generator/generator_bootstrap_summernote.js");
P.includeJS("js/generator/generator_bootstrap_validator.js");
P.includeJS("js/generator/generator_bootstrap_datepicker.js");
P.includeJS("js/generator/generator_bootstrap_select.js");
P.includeJS("js/generator/generator_font_awesome.js");
P.includeJS("js/generator/generator_assets.js");
P.includeJS("js/generator/generator_common.js");


P.includeCSS("css/weixin/main.css");
P.includeJS("js/weixin/spage.js");
P.includeJS("js/weixin/showMessage.js");
P.includeJS("js/weixin/common.js");
