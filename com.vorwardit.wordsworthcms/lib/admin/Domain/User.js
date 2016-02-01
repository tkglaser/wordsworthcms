var app;
(function (app) {
    var domain;
    (function (domain) {
        var User = (function () {
            function User(userName, password, type, siteId) {
                this.userName = userName;
                this.password = password;
                this.type = type;
                this.siteId = siteId;
            }
            return User;
        })();
        domain.User = User;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=User.js.map