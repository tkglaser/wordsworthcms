var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var PageLayoutController = (function () {
            function PageLayoutController(LayoutService, PageLayoutService, SiteService) {
                this.LayoutService = LayoutService;
                this.PageLayoutService = PageLayoutService;
                this.SiteService = SiteService;
                this.getData();
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
            PageLayoutController.prototype.getData = function () {
                var _this = this;
                this.SiteService.getData().then(function (sites) {
                    _this.sites = sites;
                    _this.site = _this.SiteService.getSelectedSite(sites);
                    _this.PageLayoutService.getBySiteId(_this.site.siteId).then(function (pageLayouts) {
                        _this.pagelayouts = pageLayouts;
                    });
                    _this.LayoutService.getBySiteId(_this.site.siteId).then(function (layouts) {
                        _this.layouts = layouts;
                    });
                });
            };
            ;
            PageLayoutController.prototype.siteChanged = function () {
                var _this = this;
                this.SiteService.setSelectedSite(this.site);
                this.PageLayoutService.getBySiteId(this.site.siteId).then(function (pageLayouts) {
                    _this.pagelayouts = pageLayouts;
                });
                this.LayoutService.getBySiteId(this.site.siteId).then(function (layouts) {
                    _this.layouts = layouts;
                });
            };
            ;
            PageLayoutController.prototype.create = function () {
                var _this = this;
                $('#saveError').hide();
                this.modalHeading = PageLayoutController.modalHeadingNew;
                this.pagelayout = new app.domain.PageLayout('', '', '', '');
                this.editor.setValue('');
                setTimeout(function () {
                    _this.editor.refresh();
                }, 200);
                $('#editModal').modal();
            };
            ;
            PageLayoutController.prototype.edit = function (pagelayout) {
                var _this = this;
                this.PageLayoutService.getData(pagelayout.pageLayoutId).then(function (pagelayout) {
                    _this.pagelayout = pagelayout;
                    $('#saveError').hide();
                    _this.modalHeading = PageLayoutController.modalHeadingEdit;
                    _this.editor.setValue(_this.pagelayout.body);
                    setTimeout(function () {
                        _this.editor.refresh();
                    }, 200);
                    $('#editModal').modal();
                });
            };
            ;
            PageLayoutController.prototype.delete = function (pagelayout) {
                $('#deleteError').hide();
                this.pagelayout = pagelayout;
                $('#deleteModal').modal();
            };
            PageLayoutController.prototype.deleteConfirmed = function () {
                var _this = this;
                this.PageLayoutService.remove(this.pagelayout.pageLayoutId).then(function () {
                    $('#deleteModal').modal('hide');
                    _this.getData();
                }, function () {
                    $('#deleteError').show();
                });
            };
            PageLayoutController.prototype.save = function () {
                var _this = this;
                var data = new app.domain.PageLayout(this.pagelayout.pageLayoutId, this.pagelayout.layoutId, this.pagelayout.name, this.editor.getValue());
                this.PageLayoutService.update(data).then(function () {
                    $('#editModal').modal("hide");
                    _this.getData();
                }, function () {
                    $('#saveError').show();
                });
            };
            PageLayoutController.modalHeadingNew = 'Neues Seitenlayout anlegen';
            PageLayoutController.modalHeadingEdit = 'Seitenlayout bearbeiten';
            PageLayoutController.$inject = ['LayoutService', 'PageLayoutService', 'SiteService'];
            return PageLayoutController;
        })();
        angular
            .module('app')
            .controller('PageLayoutController', PageLayoutController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=PageLayoutController.js.map