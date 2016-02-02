var app;
(function (app) {
    var domain;
    (function (domain) {
        var PageUrl = (function () {
            function PageUrl(pageUrlId, url) {
                this.pageUrlId = pageUrlId;
                this.url = url;
            }
            return PageUrl;
        })();
        domain.PageUrl = PageUrl;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=PageUrl.js.map