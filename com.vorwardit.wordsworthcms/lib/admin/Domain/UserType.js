var app;
(function (app) {
    var domain;
    (function (domain) {
        var UserType = (function () {
            function UserType(id, name) {
                this.id = id;
                this.name = name;
            }
            UserType.allTypes = function () {
                var result = [];
                result.push(new UserType(0, "Administrator"));
                result.push(new UserType(1, "Designer"));
                result.push(new UserType(2, "Editor"));
                return result;
            };
            return UserType;
        })();
        domain.UserType = UserType;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
