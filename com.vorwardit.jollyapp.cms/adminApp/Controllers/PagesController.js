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
        vm.modalHeadingNew = 'Neue Page anlegen';
        vm.modalHeadingEdit = 'Page bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.pages = [];
        vm.page = {};
        vm.pageversions = [];
        vm.pageversion = {};

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

        vm.editContent = function (page) {
            $('#saveContentError').hide();
            PagesFactory.getVersions(page.pageId).success(function (data) {
                if (data.length > 0) {
                    vm.pageversion = data[0];
                } else {
                    vm.pageversion = { pageId: page.pageId };
                }
                $('#editContentModal').modal();
            });
        }

        vm.showVersions = function (page) {
            $('#publishError').hide();
            vm.page = page;
            PagesFactory.getVersions(page.pageId).success(function (data) {
                vm.pageversions = data;
                $('#publishModal').modal();
            });
        }

        vm.publish = function (versionId) {
            PagesFactory.publish(versionId).then(function () {
                PagesFactory.getVersions(vm.page.pageId).success(function (data) {
                    vm.pageversions = data;
                });
            },
            function () {
                $('#publishError').show();
            });
        }

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

        vm.saveVersion = function () {
            var data = {
                PageId: vm.pageversion.pageId,
                Title: vm.pageversion.title,
                MetaDescription: vm.pageversion.metaDescription,
                Body: vm.pageversion.body
            }
            PagesFactory.updateVersion(data).then(function () {
                $('#editContentModal').modal("hide");
                activate();
            },
            function () {
                $('#saveContentError').show();
            });
        }
    }
})();
