var app;
(function (app) {
    var domain;
    (function (domain) {
        var PageLayout = (function () {
            function PageLayout(pageLayoutId, layoutId, name, body) {
                this.pageLayoutId = pageLayoutId;
                this.layoutId = layoutId;
                this.name = name;
                this.body = body;
            }
            return PageLayout;
        })();
        domain.PageLayout = PageLayout;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=PageLayout.js.map