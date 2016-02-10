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
                    _this.menuItems.push({
                        link: '',
                        isHeader: true,
                        icon: '',
                        name: 'HAUPTMENÜ'
                    });
                    if (user.type <= 1) {
                        _this.menuItems.push({
                            link: '/layouts',
                            isHeader: false,
                            icon: 'fa-anchor',
                            name: 'Layouts'
                        });
                    }
                    ;
                    if (user.type <= 2) {
                        _this.menuItems.push({
                            link: '/assets',
                            isHeader: false,
                            icon: 'fa-file',
                            name: 'Assets'
                        });
                    }
                    if (user.type <= 1) {
                        _this.menuItems.push({
                            link: '/content',
                            isHeader: false,
                            icon: 'fa-clipboard',
                            name: 'Content'
                        });
                        _this.menuItems.push({
                            link: '/pagelayouts',
                            isHeader: false,
                            icon: 'fa-book',
                            name: 'Seitenlayouts'
                        });
                    }
                    if (user.type <= 2) {
                        _this.menuItems.push({
                            link: '/pages',
                            isHeader: false,
                            icon: 'fa-file',
                            name: 'Seiten'
                        });
                    }
                    if (user.type == 0) {
                        _this.menuItems.push({
                            link: '',
                            isHeader: true,
                            icon: '',
                            name: 'ADMINISTRATION'
                        });
                        _this.menuItems.push({
                            link: '/sites',
                            isHeader: false,
                            icon: 'fa-home',
                            name: 'Webauftritte'
                        });
                        _this.menuItems.push({
                            link: '/users',
                            isHeader: false,
                            icon: 'fa-users',
                            name: 'Nutzerverwaltung'
                        });
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