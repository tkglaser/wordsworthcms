(function () {
    'use strict';

    angular
        .module('app')
        .controller('LayoutsController', LayoutsController);

    LayoutsController.$inject = ['$location', '$rootScope', 'LayoutsFactory', 'SitesFactory'];

    function LayoutsController($location, $rootScope, LayoutsFactory, SitesFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'LayoutsController';
        vm.modalHeadingNew = 'Neues Layout anlegen';
        vm.modalHeadingEdit = 'Layout bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.layouts = [];
        vm.layout = {};

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
                LayoutsFactory.getData(vm.site.siteId).success(function (data) {
                    vm.layouts = data;
                });
            });
        };

        vm.siteChanged = function () {
            $rootScope.selectedSiteId = vm.site.siteId;
            LayoutsFactory.getData(vm.site.siteId).success(function (data) {
                vm.layouts = data;
            });
        };

        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.layout = {};
            vm.layout.name = '';
            vm.layout.body = '';
            $('#editModal').modal();
        };

        vm.edit = function (layout) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.layout = {};
            vm.layout.layoutId = layout.layoutId;
            vm.layout.name = layout.name;
            vm.layout.body = layout.body;
            $('#editModal').modal();
        };

        vm.delete = function (layout) {
            $('#deleteError').hide();
            vm.layout = layout;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            LayoutsFactory.remove(vm.layout.layoutId).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            var data = {
                LayoutId: vm.layout.layoutId,
                Name: vm.layout.name,
                Body: vm.layout.body,
                SiteId: vm.site.siteId
            }
            LayoutsFactory.update(data).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
