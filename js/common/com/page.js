(function($) {
	$.extend($.fn, {
		showPage: function(options) {
			if (!this.length) {
				return;
			}
			var defaultOptions = $.data(this[0], 'pageOptions');
			if (!defaultOptions) {
				defaultOptions = {
					page: 0,
					pageSet: 2,
					totalPage: 0
				}
			}
			options = $.extend(defaultOptions, options);
			$.data(this[0], 'pageOptions', options);

			var page = Math.ceil(parseFloat(options.page));
			var set = Math.ceil(parseFloat(options.pageSet));
			var total = Math.ceil(parseFloat(options.totalPage));
			var count = Math.ceil(parseFloat(options.count));
			var hasEvent = typeof(options.onPage) == "function";

			var $ul = $('<ul class="pagination"></ul>');
			var $span = $('<span class="pageinfo"></span>');
			this.empty();
			this.append($ul);
			this.append($span);
			$span.text("第 " + page + " 页，共 " + total + " 页， " + count + " 条记录");
			if (total > 0) {
				var $first = $('<li><a href="javascript:;"><i class="fa fa-step-backward"></i></a></li>');
				var $pre = $('<li><a href="javascript:;"><i class="fa fa-backward"></i></a></li>');
				if (page <= 0) {
					page = 1;
				}
				if (page > total) {
					page = total; // 当前页数变更需要通知组件onPage
					$first.on("click", {
						page: page
					}, options.onPage);
				}
				if (page > 1) {
					$ul.append($first).append($pre);
					if (hasEvent) {
						$first.on("click", {
							page: 1
						}, options.onPage);
						$pre.on("click", {
							page: page - 1
						}, options.onPage);
					}
				} else {
					$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-step-backward"></a></li>')
					$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-backward"></i></a></li>');
				}
				if (page - set > 2) {
					var $li = $('<li><a href="javascript:;">1</a></li>');
					$ul.append($li).append('<li><a href="javascript:;">...</a></li>');
					if (hasEvent) {
						$li.on("click", {
							page: 1
						}, options.onPage);
					}
					for (var i = page - set; i < page; i++) {
						$li = $('<li><a href="javascript:;">' + i + '</a></li>');
						$ul.append($li);
						if (hasEvent) {
							$li.on("click", {
								page: i
							}, options.onPage);
						}
					}
				} else {
					for (var i = 1; i < page; i++) {
						$li = $('<li><a href="javascript:;">' + i + '</a></li>');
						$ul.append($li);
						if (hasEvent) {
							$li.on("click", {
								page: i
							}, options.onPage);
						}
					}
				}
				$ul.append('<li class="active"><a href="javascript:;">' + page + '</a></li>');

				if (page + set < total - 1) {
					var $li;
					for (var i = page + 1; i <= (page + set); i++) {
						$li = $('<li><a href="javascript:;">' + i + '</a></li>');
						$ul.append($li);
						if (hasEvent) {
							$li.on("click", {
								page: i
							}, options.onPage);
						}
					}
					$li = $('<li><a href="javascript:;">' + total + '</a></li>');
					$ul.append('<li><a href="javascript:;">...</a></li>').append($li);
					if (hasEvent) {
						$li.on("click", {
							page: total
						}, options.onPage);
					}
				} else {
					for (var i = page + 1; i <= total; i++) {
						$li = $('<li><a href="javascript:;">' + i + '</a></li>');
						$ul.append($li);
						if (hasEvent) {
							$li.on("click", {
								page: i
							}, options.onPage);
						}
					}
				}

				if (page < total) {
					var $next = $('<li><a href="javascript:;"><i class="fa fa-forward"></i></a></li>');
					var $last = $('<li><a href="javascript:;"><i class="fa fa-step-forward"></i></a></li>');
					$ul.append($next).append($last);
					if (hasEvent) {
						$last.on("click", {
							page: total
						}, options.onPage);
						$next.on("click", {
							page: page + 1
						}, options.onPage);
					}
				} else {
					$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-forward"></i></a></li>')
					$ul.append('<li class="disabled"><a href="javascript:;"><i class="fa fa-step-forward"></i></a></li>');
				}
				if (parseInt(options.page) > total) {
					this.on("click", {
						page: page
					}, options.onPage);
					this.trigger("click");
					this.unbind("on");
				}
			} else {
				$ul.append('<li class="active"><a href="javascript:;">1</a></li>');
			}
		}
	});
})(jQuery);