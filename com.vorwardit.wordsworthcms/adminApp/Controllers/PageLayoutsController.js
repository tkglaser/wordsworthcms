(function () {
    'use strict';

    angular
        .module('app')
        .controller('PageLayoutsController', PageLayoutsController);

    PageLayoutsController.$inject = ['$location', 'LayoutsFactory', 'PageLayoutsFactory', 'SitesFactory'];

    function PageLayoutsController($location, LayoutsFactory, PageLayoutsFactory, SitesFactory) {
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
        vm.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
            mode: mixedMode,
            selectionPointer: true
        });

        function activate() {
            SitesFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SitesFactory.getSelectedSite(data);
                PageLayoutsFactory.getData(vm.site.siteId).success(function (data) {
                    vm.pagelayouts = data;
                });
                LayoutsFactory.getData(vm.site.siteId, true).success(function (data) {
                    vm.layouts = data;
                });
            });
        };

        vm.siteChanged = function () {
            SitesFactory.setSelectedSite(vm.site);
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
            vm.editor.setValue('');
            setTimeout(function () {
                vm.editor.refresh();
            }, 200);
            $('#editModal').modal();
        };

        vm.edit = function (pagelayout) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.pagelayout = {};
            vm.pagelayout.pageLayoutId = pagelayout.pageLayoutId;
            vm.pagelayout.name = pagelayout.name;
            vm.pagelayout.body = pagelayout.body;
            vm.editor.setValue(pagelayout.body);
            setTimeout(function () {
                vm.editor.refresh();
            }, 200);
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
                Body: vm.editor.getValue()
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
