var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var MenuController = (function () {
            function MenuController(UserService) {
                this.UserService = UserService;
                this.menuItems = [];
                this.init();
            }
            MenuController.prototype.init = function () {
                var _this = this;
                this.UserService.getUser().then(function (user) {
                    _this.menuItems.push(new app.domain.MenuItem('', true, '', 'HAUPTMENÜ'));
                    if (user.type <= 1) {
                        _this.menuItems.push(new app.domain.MenuItem('/layouts', false, 'fa-anchor', 'Layouts'));
                    }
                    ;
                    if (user.type <= 2) {
                        _this.menuItems.push(new app.domain.MenuItem('/assets', false, 'fa-file', 'Assets'));
                    }
                    if (user.type <= 1) {
                        _this.menuItems.push(new app.domain.MenuItem('/content', false, 'fa-clipboard', 'Content'));
                        _this.menuItems.push(new app.domain.MenuItem('/pagelayouts', false, 'fa-book', 'Seitenlayouts'));
                    }
                    if (user.type <= 2) {
                        _this.menuItems.push(new app.domain.MenuItem('/pages', false, 'fa-file', 'Seiten'));
                    }
                    if (user.type == 0) {
                        _this.menuItems.push(new app.domain.MenuItem('', true, '', 'ADMINISTRATION'));
                        _this.menuItems.push(new app.domain.MenuItem('/sites', false, 'fa-home', 'Webauftritte'));
                        _this.menuItems.push(new app.domain.MenuItem('/users', false, 'fa-users', 'Nutzerverwaltung'));
                    }
                });
            };
            MenuController.$inject = ['UserService'];
            return MenuController;
        })();
        angular
            .module('app')
            .controller('MenuController', MenuController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=MenuController.js.map