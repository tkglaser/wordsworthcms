var app;
(function (app) {
    var domain;
    (function (domain) {
        var Site = (function () {
            function Site(siteId, name, bindings) {
                this.siteId = siteId;
                this.name = name;
                this.bindings = bindings;
            }
            return Site;
        })();
        domain.Site = Site;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
