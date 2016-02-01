var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var LayoutController = (function () {
            function LayoutController(LayoutService, SiteService) {
                this.LayoutService = LayoutService;
                this.SiteService = SiteService;
                this.getLayouts();
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
                this.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditorLayouts"), {
                    mode: mixedMode,
                    selectionPointer: true,
                    extraKeys: {
                        "F11": function (cm) {
                            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                        },
                        "Esc": function (cm) {
                            if (cm.getOption("fullScreen"))
                                cm.setOption("fullScreen", false);
                        }
                    }
                });
            }
            LayoutController.prototype.getLayouts = function () {
                var self = this;
                this.SiteService.getData().then(function (data) {
                    self.sites = data;
                    self.site = self.SiteService.getSelectedSite(data);
                    self.LayoutService.getBySiteId(self.site.siteId).then(function (data) {
                        self.layouts = data;
                    });
                });
            };
            LayoutController.prototype.siteChanged = function () {
                var self = this;
                this.SiteService.setSelectedSite(this.site);
                this.LayoutService.getBySiteId(this.site.siteId).then(function (data) {
                    self.layouts = data;
                });
            };
            ;
            LayoutController.prototype.create = function () {
                var self = this;
                $('#saveError').hide();
                this.modalHeading = LayoutController.modalHeadingNew;
                this.layout = new app.domain.Layout('', '', '', '');
                this.editor.setValue('');
                setTimeout(function () {
                    self.editor.refresh();
                }, 200);
                $('#editModal').modal();
            };
            ;
            LayoutController.prototype.edit = function (layout) {
                var self = this;
                this.LayoutService.getData(layout.layoutId).then(function (data) {
                    $('#saveError').hide();
                    self.modalHeading = LayoutController.modalHeadingEdit;
                    self.layout = data;
                    self.editor.setValue(self.layout.body);
                    setTimeout(function () {
                        self.editor.refresh();
                    }, 200);
                    $('#editModal').modal();
                });
            };
            ;
            LayoutController.prototype.delete = function (layout) {
                $('#deleteError').hide();
                this.layout = layout;
                $('#deleteModal').modal();
            };
            LayoutController.prototype.deleteConfirmed = function () {
                var self = this;
                this.LayoutService.remove(this.layout.layoutId).then(function () {
                    $('#deleteModal').modal('hide');
                    self.getLayouts();
                }, function () {
                    $('#deleteError').show();
                });
            };
            LayoutController.prototype.save = function () {
                var self = this;
                var data = new app.domain.Layout(this.layout.layoutId, this.layout.siteId, this.layout.name, this.editor.getValue());
                this.LayoutService.update(data).then(function () {
                    $('#editModal').modal("hide");
                    self.getLayouts();
                }, function () {
                    $('#saveError').show();
                });
            };
            LayoutController.modalHeadingNew = 'Neuen Auftritt anlegen';
            LayoutController.modalHeadingEdit = 'Auftritt bearbeiten';
            LayoutController.$inject = ['LayoutService', 'SiteService'];
            return LayoutController;
        })();
        angular
            .module('app')
            .controller('LayoutController', LayoutController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=LayoutController.js.map