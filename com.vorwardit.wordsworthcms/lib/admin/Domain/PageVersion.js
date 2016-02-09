var app;
(function (app) {
    var domain;
    (function (domain) {
        var PageVersion = (function () {
            function PageVersion(pageId, title, metaDescription) {
                this.pageId = pageId;
                this.title = title;
                this.metaDescription = metaDescription;
            }
            return PageVersion;
        })();
        domain.PageVersion = PageVersion;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=PageVersion.js.map