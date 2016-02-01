var app;
(function (app) {
    var domain;
    (function (domain) {
        var EntityBase = (function () {
            function EntityBase() {
            }
            return EntityBase;
        })();
        domain.EntityBase = EntityBase;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
