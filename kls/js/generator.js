var PY = {
	rootPath : window.location.protocol + "//" + window.location.host + "/kls/",
	includeCSS: function(path){
		document.write('<link rel="stylesheet" href="' + PY.rootPath + path + '" type="text/css"/>');
	},
	includeJS: function(path){
		document.write('<script type="text/javascript" src="' + PY.rootPath + path + '"></script>');
	}
	
};
/* css */
PY.includeCSS("js/include/bootstrap/bootstrap.min.css");
PY.includeCSS("js/include/bootstrap-select/bootstrap-select.min.css");
PY.includeCSS("css/font-awesome/css/font-awesome.min.css");
PY.includeCSS("js/assets/css/ie10-viewport-bug-workaround.css");
PY.includeCSS("css/global.css");
/* js */
PY.includeJS("js/include/jquery-1.11.1.min.js");
PY.includeJS("js/include/bootstrap/bootstrap.min.js");
PY.includeJS("js/include/bootstrap-select/bootstrap-select.min.js");
PY.includeJS("js/include/bootstrap-select/defaults-zh_CN.min.js");
PY.includeJS("js/include/enscroll-0.6.2.min.js");
document.write('<!--[if lte IE 9]>');
PY.includeJS("assets/js/ie10-viewport-bug-workaround.js");
PY.includeJS("assets/js/respond.min.js");
PY.includeJS("assets/js/html5shiv.min.js");
document.write('<![endif]-->');
PY.includeJS("js/page.js");
PY.includeJS("js/common.js");