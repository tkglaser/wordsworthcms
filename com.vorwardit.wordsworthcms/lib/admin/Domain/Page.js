var app;
(function (app) {
    var domain;
    (function (domain) {
        var Page = (function () {
            function Page(pageId, pageLayoutId, name, urls) {
                this.pageId = pageId;
                this.pageLayoutId = pageLayoutId;
                this.name = name;
                this.urls = urls;
            }
            return Page;
        })();
        domain.Page = Page;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
