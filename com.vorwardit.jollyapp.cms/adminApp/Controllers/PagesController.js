(function () {
    'use strict';

    angular
        .module('app')
        .controller('PagesController', PagesController);

    PagesController.$inject = ['$location', 'PagesFactory', 'SitesFactory', 'PageLayoutsFactory'];

    function PagesController($location, PagesFactory, SitesFactory, PageLayoutsFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PagesController';
        vm.modalHeadingNew = 'Neues Layout anlegen';
        vm.modalHeadingEdit = 'Layout bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.pages = [];
        vm.page = {};

        vm.pageLayouts = [];
        vm.sites = [];

        activate();

        function activate() {
            PagesFactory.getData().success(function (data) {
                vm.pages = data;
            });
            PageLayoutsFactory.getData(true).success(function (data) {
                vm.pageLayouts = data;
            });
            SitesFactory.getData().success(function (data) {
                vm.sites = data;
            });
        }

        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.page = {};
            vm.page.name = '';
            vm.page.urls = [{ url: '', pageUrlId: -1 }];
            $('#editModal').modal();
        };

        vm.edit = function (page) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.page = {};
            vm.page.pageId = page.pageId;
            vm.page.name = page.name;
            vm.page.siteId = page.siteId;
            vm.page.pageLayoutId = page.pageLayoutId;
            vm.page.urls = angular.copy(page.urls);
            $('#editModal').modal();
        };

        vm.addUrl = function () {
            vm.page.urls.push({ url: '', pageUrlId: -1 });
        }

        vm.removeUrl = function (url) {
            var index = vm.page.urls.indexOf(url);
            vm.page.urls.splice(index, 1);
        }

        vm.delete = function (page) {
            $('#deleteError').hide();
            vm.page = page;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            PagesFactory.remove(vm.page.pageId).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            var data = {
                PageId: vm.page.pageId,
                Name: vm.page.name,
                SiteId: vm.page.siteId,
                PageLayoutId: vm.page.pageLayoutId,
                Urls: vm.page.urls
            }
            PagesFactory.update(data).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
