(function () {
    'use strict';

    angular
        .module('app')
        .controller('AssetsController', AssetsController);

    AssetsController.$inject = ['$location', '$rootScope', 'AssetsFactory', 'SitesFactory'];

    function AssetsController($location, $rootScope, AssetsFactory, SitesFactory) {
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
                if (typeof $rootScope.selectedSiteId === 'undefined') {
                    vm.site = data[0];
                } else {
                    angular.forEach(data, function (site) {
                        if ($rootScope.selectedSiteId == site.siteId) {
                            vm.site = site;
                        };
                    });
                }
                AssetsFactory.getData(vm.site.siteId).success(function (data) {
                    vm.assets = data;
                });
            });
        }

        vm.siteChanged = function () {
            $rootScope.selectedSiteId = vm.site.siteId;
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
