var app;
(function (app) {
    var domain;
    (function (domain) {
        var Asset = (function () {
            function Asset(name, siteId, uri, file) {
                this.name = name;
                this.siteId = siteId;
                this.uri = uri;
                this.file = file;
            }
            return Asset;
        })();
        domain.Asset = Asset;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=Asset.js.map