(function () {
    'use strict';

    angular
        .module('app')
        .controller('SiteController', SiteController);

    SiteController.$inject = ['$location', 'SiteFactory'];

    function SiteController($location, SiteFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'SiteController';
        vm.modalHeadingNew = 'Neuen Auftritt anlegen';
        vm.modalHeadingEdit = 'Auftritt bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.sites = [];
        vm.site = {};

        activate();

        function activate() {
            SiteFactory.getData().success(function (data) {
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
            SiteFactory.remove(vm.site.siteId).then(function () {
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
            SiteFactory.update(newSite).then(function () {
                $('#editSiteModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
