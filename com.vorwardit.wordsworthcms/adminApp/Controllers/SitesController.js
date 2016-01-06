(function () {
    'use strict';

    angular
        .module('app')
        .controller('SitesController', SitesController);

    SitesController.$inject = ['$location', 'SitesFactory'];

    function SitesController($location, SitesFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'SitesController';
        vm.modalHeadingNew = 'Neue Site anlegen';
        vm.modalHeadingEdit = 'Site bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.sites = [];
        vm.site = {};

        activate();

        function activate() {
            SitesFactory.getData().success(function (data) {
                vm.sites = data;
            });
        };

        vm.newSite = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.site = {};
            vm.site.name = '';
            vm.site.bindings = [{value:''}];
            $('#editSiteModal').modal();
        };

        vm.editSite = function (site) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.site = {};
            vm.site.siteId = site.siteId;
            vm.site.name = site.name;
            vm.site.bindings = [];
            angular.forEach(site.bindings, function (binding) {
                vm.site.bindings.push({ value: binding });
            });
            $('#editSiteModal').modal();
        };

        vm.deleteSite = function (site) {
            $('#deleteError').hide();
            vm.site = site;
            $('#deleteSiteModal').modal();
        }

        vm.deleteConfirmed = function () {
            SitesFactory.remove(vm.site.siteId).then(function () {
                $('#deleteSiteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.addBinding = function () {
            vm.site.bindings.push({ value: '' });
        }

        vm.removeBinding = function (binding) {
            var index = vm.site.bindings.indexOf(binding);
            vm.site.bindings.splice(index, 1);
        }

        vm.save = function () {
            var newSite = {
                SiteId: vm.site.siteId,
                Name: vm.site.name,
                Bindings: []
            }
            angular.forEach(vm.site.bindings, function (binding) {
                newSite.Bindings.push(binding.value);
            });
            SitesFactory.update(newSite).then(function () {
                $('#editSiteModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
