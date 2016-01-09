(function () {
    'use strict';

    angular
        .module('app')
        .controller('PageLayoutsController', PageLayoutsController);

    PageLayoutsController.$inject = ['$location', '$rootScope', 'LayoutsFactory', 'PageLayoutsFactory', 'SitesFactory'];

    function PageLayoutsController($location, $rootScope, LayoutsFactory, PageLayoutsFactory, SitesFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PageLayoutsController';
        vm.modalHeadingNew = 'Neues Layout anlegen';
        vm.modalHeadingEdit = 'Layout bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.pagelayouts = [];
        vm.pagelayout = {};
        vm.layouts = [];
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
                PageLayoutsFactory.getData(vm.site.siteId).success(function (data) {
                    vm.pagelayouts = data;
                });
                LayoutsFactory.getData(vm.site.siteId, true).success(function (data) {
                    vm.layouts = data;
                });
            });
        };

        vm.siteChanged = function () {
            $rootScope.selectedSiteId = vm.site.siteId;
            PageLayoutsFactory.getData(vm.site.siteId).success(function (data) {
                vm.pagelayouts = data;
            });
            LayoutsFactory.getData(vm.site.siteId, true).success(function (data) {
                vm.layouts = data;
            });
        };

        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.pagelayout = {};
            vm.pagelayout.name = '';
            vm.pagelayout.body = '';
            $('#editModal').modal();
        };

        vm.edit = function (pagelayout) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.pagelayout = {};
            vm.pagelayout.pageLayoutId = pagelayout.pageLayoutId;
            vm.pagelayout.name = pagelayout.name;
            vm.pagelayout.body = pagelayout.body;
            vm.pagelayout.layoutId = pagelayout.layoutId;
            $('#editModal').modal();
        };

        vm.delete = function (pagelayout) {
            $('#deleteError').hide();
            vm.pagelayout = pagelayout;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            PageLayoutsFactory.remove(vm.pagelayout.pageLayoutId).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            var data = {
                PageLayoutId: vm.pagelayout.pageLayoutId,
                LayoutId: vm.pagelayout.layoutId,
                Name: vm.pagelayout.name,
                Body: vm.pagelayout.body
            }
            PageLayoutsFactory.update(data).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
