(function () {
    'use strict';

    angular
        .module('app')
        .controller('PageLayoutController', PageLayoutController);

    PageLayoutController.$inject = ['$location', 'LayoutFactory', 'PageLayoutFactory', 'SiteFactory'];

    function PageLayoutController($location, LayoutFactory, PageLayoutFactory, SiteFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PageLayoutController';
        vm.modalHeadingNew = 'Neues Seitenlayout anlegen';
        vm.modalHeadingEdit = 'Seitenlayout bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.pagelayouts = [];
        vm.pagelayout = {};
        vm.layouts = [];
        vm.sites = [];
        vm.site = {};

        activate();

        var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [{
                matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null
            },
            {
                matches: /(text|application)\/(x-)?vb(a|script)/i,
                mode: "vbscript"
            }]
        };
        vm.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditorPageLayout"), {
            mode: mixedMode,
            selectionPointer: true
        });

        function activate() {
            SiteFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SiteFactory.getSelectedSite(data);
                PageLayoutFactory.getBySiteId(vm.site.siteId).success(function (data) {
                    vm.pagelayouts = data;
                });
                LayoutFactory.getBySiteId(vm.site.siteId).success(function (data) {
                    vm.layouts = data;
                });
            });
        };

        vm.siteChanged = function () {
            SiteFactory.setSelectedSite(vm.site);
            PageLayoutFactory.getBySiteId(vm.site.siteId).success(function (data) {
                vm.pagelayouts = data;
            });
            LayoutFactory.getBySiteId(vm.site.siteId).success(function (data) {
                vm.layouts = data;
            });
        };

        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.pagelayout = {};
            vm.pagelayout.name = '';
            vm.pagelayout.body = '';
            vm.editor.setValue('');
            setTimeout(function () {
                vm.editor.refresh();
            }, 200);
            $('#editModal').modal();
        };

        vm.edit = function (pagelayout) {
            PageLayoutFactory.getData(pagelayout.pageLayoutId).success(function (data) {
                vm.pagelayout = data;
                $('#saveError').hide();
                vm.modalHeading = vm.modalHeadingEdit;
                vm.editor.setValue(vm.pagelayout.body);
                setTimeout(function () {
                    vm.editor.refresh();
                }, 200);
                $('#editModal').modal();
            });
        };

        vm.delete = function (pagelayout) {
            $('#deleteError').hide();
            vm.pagelayout = pagelayout;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            PageLayoutFactory.remove(vm.pagelayout.pageLayoutId).then(function () {
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
                Body: vm.editor.getValue()
            }
            PageLayoutFactory.update(data).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();
