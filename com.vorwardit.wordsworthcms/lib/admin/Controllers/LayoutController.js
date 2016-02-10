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
                var _this = this;
                this.SiteService.getData().then(function (data) {
                    _this.sites = data;
                    _this.site = _this.SiteService.getSelectedSite(data);
                    _this.LayoutService.getBySiteId(_this.site.siteId).then(function (data) {
                        _this.layouts = data;
                    });
                });
            };
            LayoutController.prototype.siteChanged = function () {
                var _this = this;
                this.SiteService.setSelectedSite(this.site);
                this.LayoutService.getBySiteId(this.site.siteId).then(function (data) {
                    _this.layouts = data;
                });
            };
            ;
            LayoutController.prototype.create = function () {
                var _this = this;
                $('#saveError').hide();
                this.modalHeading = LayoutController.modalHeadingNew;
                this.layout = {
                    body: '',
                    layoutId: '',
                    name: '',
                    siteId: this.site.siteId
                };
                this.editor.setValue('');
                setTimeout(function () {
                    _this.editor.refresh();
                }, 200);
                $('#editModal').modal();
            };
            ;
            LayoutController.prototype.edit = function (layout) {
                var _this = this;
                this.LayoutService.getData(layout.layoutId).then(function (data) {
                    $('#saveError').hide();
                    _this.modalHeading = LayoutController.modalHeadingEdit;
                    _this.layout = data;
                    _this.editor.setValue(_this.layout.body);
                    setTimeout(function () {
                        _this.editor.refresh();
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
                var _this = this;
                this.LayoutService.remove(this.layout.layoutId).then(function () {
                    $('#deleteModal').modal('hide');
                    _this.getLayouts();
                }, function () {
                    $('#deleteError').show();
                });
            };
            LayoutController.prototype.save = function () {
                var _this = this;
                this.layout.body = this.editor.getValue();
                this.LayoutService.update(this.layout).then(function () {
                    $('#editModal').modal("hide");
                    _this.getLayouts();
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