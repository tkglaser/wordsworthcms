(function () {
    'use strict';

    angular
        .module('app')
        .controller('AssetsController', AssetsController);

    AssetsController.$inject = ['$location', 'AssetsFactory'];

    function AssetsController($location, AssetsFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'AssetsController';
        vm.assets = [];
        vm.asset = {};

        activate();

        function activate() {
            AssetsFactory.getData().success(function (data) {
                vm.assets = data;
            });
        }

        vm.create = function () {
            $('#saveError').hide();
            $('#editModal').modal();
        };

        vm.delete = function (asset) {
            $('#deleteError').hide();
            vm.asset = asset;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            AssetsFactory.remove(vm.asset.name).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            AssetsFactory.upload(vm.asset).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
