(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$location', 'UserFactory', 'SiteFactory']; 

    function UserController($location, UserFactory, SiteFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'UserController';
        vm.modalHeadingNew = 'Neuen Nutzer anlegen';
        vm.modalHeadingEdit = 'Nutzer bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.showPasswordBox = false;
        vm.users = [];
        vm.user = {};
        vm.userTypes = [
            {
                id: 0,
                name: "Administrator"
            },
            {
                id: 1,
                name: "Designer"
            },
            {
                id: 2,
                name: "Editor"
            }
        ];

        vm.sites = [];

        activate();

        function activate() {
            SiteFactory.getData().success(function (data) {
                vm.sites = data;
            });
            UserFactory.getAll().success(function (data) {
                vm.users = data;
            });
        }

        vm.displayUserType = function (t) {
            for (var i = 0; i < vm.userTypes.length; ++i) {
                var type = vm.userTypes[i];
                if (type.id == t) {
                    return type.name;
                }
            }
            return "Unbekannt";
        }

        vm.newUser = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.showPasswordBox = true;
            vm.user = {};
            vm.user.userName = '';
            vm.user.type = "2";
            $('#editModal').modal();
        };

        vm.editUser = function (user) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.showPasswordBox = false;
            vm.user = {};
            vm.user.userId = user.userId;
            vm.user.userName = user.userName;
            vm.user.type = user.type.toString();
            vm.user.siteId = user.siteId;
            $('#editModal').modal();
        };

        vm.save = function () {
            if (vm.user.userId == null) {
                var data = {
                    UserName: vm.user.userName,
                    Password: vm.user.password,
                    Type: vm.user.type,
                    SiteId: vm.user.siteId
                }
                UserFactory.create(data).then(function () {
                    $('#editModal').modal("hide");
                    activate();
                },
                function () {
                    $('#saveError').show();
                });
            } else {
                var data = {
                    UserId: vm.user.userId,
                    UserName: vm.user.userName,
                    Type: vm.user.type,
                    SiteId: vm.user.siteId
                }
                UserFactory.update(data).then(function () {
                    $('#editModal').modal("hide");
                    activate();
                },
                function () {
                    $('#saveError').show();
                });
            }
        }

        vm.deleteUser = function (user) {
            $('#deleteError').hide();
            vm.user = user;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            UserFactory.remove(vm.user.userId).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

    }
})();
