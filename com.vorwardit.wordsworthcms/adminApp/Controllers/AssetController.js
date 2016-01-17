(function () {
    'use strict';

    angular
        .module('app')
        .controller('AssetController', AssetController);

    AssetController.$inject = ['$location', 'AssetFactory', 'SiteFactory'];

    function AssetController($location, AssetFactory, SiteFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'AssetController';
        vm.assets = [];
        vm.asset = {};

        vm.sites = [];
        vm.site = {};

        activate();

        function activate() {
            SiteFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SiteFactory.getSelectedSite(data);
                AssetFactory.getData(vm.site.siteId).success(function (data) {
                    vm.assets = data;
                });
            });
        }

        vm.siteChanged = function () {
            SiteFactory.setSelectedSite(vm.site);
            AssetFactory.getData(vm.site.siteId).success(function (data) {
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
            AssetFactory.remove(vm.site.siteId, vm.asset.name).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            vm.asset.siteId = vm.site.siteId;
            AssetFactory.upload(vm.asset).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
