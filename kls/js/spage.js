var SPage = function(el, pageSize) {
	this.el = el;
	this.pageSize = pageSize || 10;
	this.pageIndex = 0;
	this.max = 0;
	this.count = 0;
	this.isLoading = false;
	this.isNoData = false;
}

SPage.prototype = {
	init : function() {
		this.create();
		this.attachEvent();
	},
	getComponent : function() {
		return this.component;
	},
	create : function() {
		this.component = $("<div>").addClass("spage");
		this.el.append(this.component);
	},
	attachEvent : function() {
		var $this = this;
		$(window).scroll(function() {
			// 已经滚动到上面的页面高度
			var scrollTop = $(window).scrollTop();
			// 页面高度
			var scrollHeight = $(document).height();
			// 浏览器窗口高度
			var windowHeight = $(window).height();
			// 此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
			if (scrollTop + windowHeight >= scrollHeight - 5) {
				if (!$this.isLoading && !$this.isNoData) {
					$this.addLoading();
					setTimeout(function() {
						$this.removeLoading();
					}, 3000);
					$this.pageIndex++;
					$this.pageEvent();
				}
			}
		});
	},
	pageEvent : function() {
		if (this.count > 0) {
			var event = new $.Event("pageChange");
			this.component.trigger(event);
		}
	},
	setPageCount : function(count) {
		this.count = count;
		if (count <= this.pageSize * (this.pageIndex + 1)) {
			this.addNoData();
		}
	},
	setResultCount : function(resultCount) {
		this.removeLoading();
		if (resultCount < this.pageSize) {
			this.addNoData();
			return;
		}
		var currentCount = this.pageSize * this.pageIndex + resultCount;
		if (this.count > 0 && currentCount >= this.count) {
			this.addNoData();
		}
	},
	reset : function() {
		this.pageIndex = 0;
		this.count = 0;
		this.isLoading = false;
		this.isNoData = false;
		this.component.empty();
		
		delete this.loading;
		delete this.nodata;
	},
	addLoading : function() {
		if (!this.loading) {
			this.loading = $("<span>正在加载更多数据</span>");
			this.component.append(this.loading);
		}
		this.isLoading = true;
	},
	removeLoading : function() {
		if (this.loading) {
			this.loading.remove();
			delete this.loading;
		}
		this.isLoading = false;
	},
	addNoData : function() {
		if (!this.nodata) {
			this.nodata = $("<span>没有更多数据</span>");
			this.component.append(this.nodata);
		}
		this.isNoData = true;
	}
}