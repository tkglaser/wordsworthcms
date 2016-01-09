(function () {
    'use strict';

    angular
        .module('app')
        .controller('AssetsController', AssetsController);

    AssetsController.$inject = ['$location', 'AssetsFactory', 'SitesFactory'];

    function AssetsController($location, AssetsFactory, SitesFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'AssetsController';
        vm.assets = [];
        vm.asset = {};

        vm.sites = [];
        vm.site = {};

        activate();

        function activate() {
            SitesFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SitesFactory.getSelectedSite(data);
                AssetsFactory.getData(vm.site.siteId).success(function (data) {
                    vm.assets = data;
                });
            });
        }

        vm.siteChanged = function () {
            SitesFactory.setSelectedSite(vm.site);
            AssetsFactory.getData(vm.site.siteId).success(function (data) {
                vm.assets = data;
            });
        };

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
            AssetsFactory.remove(vm.site.siteId, vm.asset.name).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            vm.asset.siteId = vm.site.siteId;
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
