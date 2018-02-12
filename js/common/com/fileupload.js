var createFileOpts = function(option) {
	option = option || {};
	var opts = {
		language: 'zh',
		theme: 'fa',
		uploadUrl: P.rootPath + 'upload.ajax',
		// allowedFileExtensions: ['jpg', 'png', 'gif'],
		dropZoneEnabled: false,
		showClose: false,
		maxFileCount: 1,
		maxFileSize: 2048,
		fileActionSettings: {
			showZoom: false,
			showRemove: false
		},
		previewSettings: {
			image: {
				width: "100%",
				height: "auto"
			}
		},
		previewZoomSettings: {
			image: {
				// 'max-width': "100%",
				// 'max-height': "300px"
			}
		},
		layoutTemplates: {
			footer: '<div class="file-thumbnail-footer">\n' + '{actions}\n' + '</div>',
			actions: '<div class="file-actions">\n' + '<div class="file-footer-buttons">\n' + '{zoom} {other}' + '</div>\n' + '{drag}\n' + '<div class="clearfix"></div>\n' + '</div>'
		}
	};
	return $.extend(opts, option);
}

var addFilePreviewOpts = function(opts, imgPath) {
	if (typeof imgPath === "undefined" || imgPath == "")
		return;
	var imgArr = imgPath.split("#");
	for (var i in imgArr) {
		imgArr[i] = P.uploadImgPath + imgArr[i];
	}
	opts.initialPreview = imgArr;
	opts.initialPreviewAsData = true;
}

var addFileReadonlyOpts = function(opts) {
	$.extend(opts, {
		showUpload: false,
		showRemove: false,
		showBrowse: false,
		showCaption: false
	});
}

var fileuploadedHandler = function(target, imgIdDom, imgPathDom, suffixDom) {
	target.on('fileuploaded', function(event, data, previewId, index) {
		if (data.response.status == 1) {
			var fileData = "file_data";
			if (typeof $(this).attr("name") !== "undefined")
				fileData = $(this).attr("name");
			if (imgIdDom != null && typeof imgIdDom !== "undefined") {
				if (imgIdDom.val() !== "") {
					imgIdDom.val(imgIdDom.val() + "#" + data.response[fileData].docId).change();
				} else {
					imgIdDom.val(data.response[fileData].docId).change();
				}
			}
			if (imgPathDom != null && typeof imgPathDom !== "undefined") {
				if (imgPathDom.val() !== "") {
					imgPathDom.val(imgPathDom.val() + "#" + data.response[fileData].path);
				} else {
					imgPathDom.val(data.response[fileData].path);
				}
			}
			if (typeof suffixDom !== "undefined") {
				if (suffixDom.val() !== "") {
					suffixDom.val(suffixDom.val() + "#" + data.response[fileData].suffix);
				} else {
					suffixDom.val(data.response[fileData].suffix);
				}
			}
			showInfo(1, "上传成功");
		} else {
			showInfo(3, "上传失败");
		}
	});
}

var fileclearedHandler = function(target, imgIdDom, imgPathDom, suffixDom) {
	target.on('filecleared', function(event) {
		if (typeof imgIdDom !== "undefined")
			imgIdDom.val("");
		if (typeof imgPathDom !== "undefined")
			imgPathDom.val("");
		if (typeof suffixDom !== "undefined")
			suffixDom.val("");
	});
}