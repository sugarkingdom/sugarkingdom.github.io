var createNote = function(noteId) {
	var opts = {
		lang: 'zh-CN',
		height: '300px',
		toolbar: [
			['style', ['style']],
			['font', ['bold', 'underline', 'clear']],
			['fontname', ['fontname']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['table', ['table']],
			['insert', ['hr', 'link', 'video']],
			['view', ['fullscreen', 'codeview', 'help']]
		],
		callbacks: {
			onInit: function() {
				var imageBtn = $('<button>').attr('type', 'button').addClass('note-btn btn btn-default btn-sm');
				imageBtn.append($('<i>').addClass('note-icon-picture')).append("&nbsp;上传图片");
				imageBtn.appendTo($("#" + noteId).parent().find('.note-btn-group.btn-group.note-insert'));
				imageBtn.on("click", function(event) {
					createNoteFileDialog(noteId);
					// $('#' + noteId + 'ImageFile').trigger('fileselect');
				});
			},
		}
	};
	$("#" + noteId).summernote(opts);
};

var createNoteFileDialog = function(noteId) {
	var dialogContent = $('<div>').addClass('row').append(
		$('<div>').addClass('col-sm-12').append($('<input>').attr({
			type: 'file',
			id: noteId + 'ImageFile'
		})).append($('<input>').attr({
			type: 'hidden',
			id: noteId + 'Image'
		})).append($('<input>').attr({
			type: 'hidden',
			id: noteId + 'ImageSuffix'
		}))
	);
	bootbox.dialog({
		title: '选择图片',
		message: dialogContent[0].outerHTML,
		// backdrop: false,
		buttons: {
			noclose: {
				label: "选择",
				className: 'btn-primary',
				callback: function() {
					if ($('#' + noteId + 'Image').val() == "") {
						showInfo(3, "请上传图片");
						return false;
					}
					addNoteImage(noteId, $('#' + noteId + 'Image').val() + "." + $('#' + noteId + 'ImageSuffix').val());
					$('#' + noteId + 'ImageFile').fileinput("reset");
					// $('#' + noteId + 'ImageFile').fileinput(noteImageFileOpts);
					return true;
				}
			},
			cancel: {
				label: "返回",
				className: 'btn-default',
				callback: function() {
					return true;
				}
			},
		}
	});
	var noteImageFileOpts = createFileOpts();
	$('#' + noteId + 'ImageFile').fileinput(noteImageFileOpts);
	fileuploadedHandler($('#' + noteId + 'ImageFile'), $('#' + noteId + 'Image'), null, $('#' + noteId + 'ImageSuffix'));
	fileclearedHandler($('#' + noteId + 'ImageFile'), $('#' + noteId + 'ImageFile'), $('#' + noteId + 'ImageSuffix'));
};

var addNoteImage = function(noteId, imgPath) {
	if (typeof imgPath === "undefined")
		return;
	$('#' + noteId).summernote('insertImage', (P.uploadImgPath + imgPath));
}

var setNoteCode = function(noteId, code) {
	$('#' + noteId).summernote("code", code);
};

var getNoteCode = function(noteId) {
	return $('#' + noteId).summernote('code');
};
