(function () {
    'use strict';

    angular
        .module('app')
        .controller('ContentController', ContentController);

    ContentController.$inject = ['$location', 'ContentFactory', 'SitesFactory'];

    function ContentController($location, ContentFactory, SitesFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'ContentController';
        vm.modalHeadingNew = 'Neuen Content anlegen';
        vm.modalHeadingEdit = 'Content bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.contents = [];
        vm.content = {};

        vm.sites = [];
        vm.site = {};

        activate();

        function activate() {
            SitesFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SitesFactory.getSelectedSite(data);
                ContentFactory.getData(vm.site.siteId).success(function (data) {
                    vm.contents = data;
                });
            });
        };

        vm.siteChanged = function () {
            SitesFactory.setSelectedSite(vm.site);
            ContentFactory.getData(vm.site.siteId).success(function (data) {
                vm.contents = data;
            });
        };

        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.content = {};
            vm.content.contentId = -1;
            vm.content.url = '';
            vm.content.body = '';
            $('#editModal').modal();
        };

        vm.edit = function (content) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.content = {};
            vm.content.contentId = content.contentId;
            vm.content.url = content.url;
            vm.content.body = content.body;
            $('#editModal').modal();
        };

        vm.delete = function (content) {
            $('#deleteError').hide();
            vm.content = content;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            ContentFactory.remove(vm.content.contentId).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            var data = {
                ContentId: vm.content.contentId,
                SiteId: vm.site.siteId,
                Url: vm.content.url,
                Body: vm.content.body
            };
            ContentFactory.update(data).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
