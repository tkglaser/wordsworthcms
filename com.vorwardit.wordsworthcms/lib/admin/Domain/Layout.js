var app;
(function (app) {
    var domain;
    (function (domain) {
        var Layout = (function () {
            function Layout(layoutId, siteId, name, body) {
                this.layoutId = layoutId;
                this.siteId = siteId;
                this.name = name;
                this.body = body;
            }
            return Layout;
        })();
        domain.Layout = Layout;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=Layout.js.map