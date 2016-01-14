(function () {
    'use strict';

    angular
        .module('app')
        .controller('LayoutsController', LayoutsController);

    LayoutsController.$inject = ['$location', 'LayoutsFactory', 'SitesFactory'];

    function LayoutsController($location, LayoutsFactory, SitesFactory) {
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
        vm.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditorLayouts"), {
            mode: mixedMode,
            selectionPointer: true
        });

        function activate() {
            SitesFactory.getData().success(function (data) {
                vm.sites = data;
                vm.site = SitesFactory.getSelectedSite(data);
                LayoutsFactory.getData(vm.site.siteId).success(function (data) {
                    vm.layouts = data;
                });
            });
        };

        vm.siteChanged = function () {
            SitesFactory.setSelectedSite(vm.site);
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
            vm.editor.setValue('');
            setTimeout(function () {
                vm.editor.refresh();
            }, 200);
            $('#editModal').modal();
        };

        vm.edit = function (layout) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.layout = {};
            vm.layout.layoutId = layout.layoutId;
            vm.layout.name = layout.name;
            vm.layout.body = layout.body;
            vm.editor.setValue(layout.body);
            setTimeout(function () {
                vm.editor.refresh();
            }, 200);
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
                Body: vm.editor.getValue(),
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
