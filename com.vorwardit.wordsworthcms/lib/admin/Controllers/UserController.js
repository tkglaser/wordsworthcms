var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var UserController = (function () {
            function UserController(UserService, SiteService) {
                this.UserService = UserService;
                this.SiteService = SiteService;
                this.getData();
                this.userTypes = app.domain.UserType.allTypes();
            }
            UserController.prototype.getData = function () {
                var _this = this;
                this.SiteService.getData().then(function (sites) {
                    _this.sites = sites;
                });
                this.UserService.getAll().then(function (data) {
                    _this.users = data;
                });
            };
            UserController.prototype.displayUserType = function (t) {
                for (var i = 0; i < this.userTypes.length; ++i) {
                    var type = this.userTypes[i];
                    if (type.id == t) {
                        return type.name;
                    }
                }
                return "Unbekannt";
            };
            UserController.prototype.newUser = function () {
                $('#saveError').hide();
                this.modalHeading = UserController.modalHeadingNew;
                this.showPasswordBox = true;
                this.user = new app.domain.User('', '', '', 2, '');
                $('#editModal').modal();
            };
            ;
            UserController.prototype.editUser = function (user) {
                $('#saveError').hide();
                this.modalHeading = UserController.modalHeadingEdit;
                this.showPasswordBox = false;
                this.user = new app.domain.User(user.userId, user.userName, '', user.type, user.siteId);
                $('#editModal').modal();
            };
            ;
            UserController.prototype.save = function () {
                var _this = this;
                if (this.user.userId == '') {
                    var data = new app.domain.User('', this.user.userName, this.user.password, this.user.type, this.user.siteId);
                    this.UserService.create(data).then(function () {
                        $('#editModal').modal("hide");
                        _this.getData();
                    }, function () {
                        $('#saveError').show();
                    });
                }
                else {
                    var data = new app.domain.User(this.user.userId, this.user.userName, '', this.user.type, this.user.siteId);
                    this.UserService.update(data).then(function () {
                        $('#editModal').modal("hide");
                        _this.getData();
                    }, function () {
                        $('#saveError').show();
                    });
                }
            };
            UserController.prototype.deleteUser = function (user) {
                $('#deleteError').hide();
                this.user = user;
                $('#deleteModal').modal();
            };
            UserController.prototype.deleteConfirmed = function () {
                var _this = this;
                this.UserService.remove(this.user.userId).then(function () {
                    $('#deleteModal').modal('hide');
                    _this.getData();
                }, function () {
                    $('#deleteError').show();
                });
            };
            UserController.modalHeadingNew = 'Neuen Nutzer anlegen';
            UserController.modalHeadingEdit = 'Nutzer bearbeiten';
            UserController.$inject = ['UserService', 'SiteService'];
            return UserController;
        })();
        angular
            .module('app')
            .controller('UserController', UserController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
