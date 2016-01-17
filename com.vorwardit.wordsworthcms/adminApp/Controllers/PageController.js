(function () {
    'use strict';

    angular
        .module('app')
        .controller('PageController', PageController);

    PageController.$inject = ['$location', 'PageFactory', 'SiteFactory', 'PageLayoutFactory'];

    function PageController($location, PageFactory, SiteFactory, PageLayoutFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PageController';
        vm.modalHeadingNew = 'Neue Page anlegen';
        vm.modalHeadingEdit = 'Page bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.pages = [];
        vm.page = {};
        vm.pageversions = [];
        vm.pageversion = {};

        vm.pageLayouts = [];

        vm.sites = [];
        vm.site = {};

        activate();

        function activate() {
            SiteFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SiteFactory.getSelectedSite(data);
                PageFactory.getBySiteId(vm.site.siteId).success(function (data) {
                    vm.pages = data;
                });
                PageLayoutFactory.getBySiteId(vm.site.siteId).success(function (data) {
                    vm.pageLayouts = data;
                });
            });
        };

        vm.siteChanged = function () {
            SiteFactory.setSelectedSite(vm.site);
            PageFactory.getBySiteId(vm.site.siteId).success(function (data) {
                vm.pages = data;
            });
            PageLayoutFactory.getBySiteId(vm.site.siteId).success(function (data) {
                vm.pageLayouts = data;
            });
        };

        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.page = {};
            vm.page.name = '';
            vm.page.urls = [{ url: '', pageUrlId: -1 }];
            $('#editModal').modal();
        };

        vm.edit = function (page) {
            PageFactory.getData(page.pageId).success(function (data) {
                $('#saveError').hide();
                vm.modalHeading = vm.modalHeadingEdit;
                vm.page = data;
                $('#editModal').modal();
            });
        };

        vm.editContent = function (page) {
            $('#saveContentError').hide();
            PageFactory.getVersions(page.pageId).success(function (data) {
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
            PageFactory.getVersions(page.pageId).success(function (data) {
                vm.pageversions = data;
                $('#publishModal').modal();
            });
        }

        vm.newVersion = function () {
            PageFactory.createNewVersion(vm.page.pageId).success(function () {
                PageFactory.getVersions(vm.page.pageId).success(function (data) {
                    vm.pageversions = data;
                });
            });
        }

        vm.publish = function (versionId) {
            PageFactory.publish(versionId).then(function () {
                PageFactory.getVersions(vm.page.pageId).success(function (data) {
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
            PageFactory.remove(vm.page.pageId).then(function () {
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
                PageLayoutId: vm.page.pageLayoutId,
                Urls: vm.page.urls
            }
            PageFactory.update(data).then(function () {
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
                MetaDescription: vm.pageversion.metaDescription
            }
            PageFactory.updateVersion(data).then(function () {
                $('#editContentModal').modal("hide");
                activate();
            },
            function () {
                $('#saveContentError').show();
            });
        }
    }
})();
