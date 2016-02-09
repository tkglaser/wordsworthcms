var app;
(function (app) {
    var domain;
    (function (domain) {
        var MenuItem = (function () {
            function MenuItem(link, isHeader, icon, name) {
                this.link = link;
                this.isHeader = isHeader;
                this.icon = icon;
                this.name = name;
            }
            return MenuItem;
        })();
        domain.MenuItem = MenuItem;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=MenuItem.js.map