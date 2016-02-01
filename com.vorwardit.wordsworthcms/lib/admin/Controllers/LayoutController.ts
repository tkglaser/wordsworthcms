declare var CodeMirror: any;

module app.controllers {
    class LayoutController {

        editor: any;

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        layouts: app.domain.ILayout[];
        layout: app.domain.ILayout;

        static modalHeadingNew: string = 'Neuen Auftritt anlegen';
        static modalHeadingEdit: string = 'Auftritt bearbeiten';
        modalHeading: string;

        static $inject = ['LayoutService', 'SiteService'];
        constructor(
            private LayoutService: app.services.ILayoutService,
            private SiteService: app.services.ISiteService)
        {
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
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    }
                }
            });
        }

        getLayouts(): void {
            var self = this;
            this.SiteService.getData().then(function (data) {
                self.sites = data;
                self.site = self.SiteService.getSelectedSite(data);
                self.LayoutService.getBySiteId(self.site.siteId).then(function (data) {
                    self.layouts = data;
                });
            });
        }

        siteChanged(): void {
            var self = this;
            this.SiteService.setSelectedSite(this.site);
            this.LayoutService.getBySiteId(this.site.siteId).then(function (data) {
                self.layouts = data;
            });
        };

        create(): void {
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

        edit(layout: app.domain.ILayout): void {
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

        delete(layout: app.domain.ILayout): void {
            $('#deleteError').hide();
            this.layout = layout;
            $('#deleteModal').modal();
        }

        deleteConfirmed(): void {
            var self = this;
            this.LayoutService.remove(this.layout.layoutId).then(
                function () {
                    $('#deleteModal').modal('hide');
                    self.getLayouts();
                },
                function () {
                    $('#deleteError').show();
                })
        }

        save(): void {
            var self = this;
            var data = new app.domain.Layout(
                this.layout.layoutId,
                this.layout.siteId,
                this.layout.name,
                this.editor.getValue());
            this.LayoutService.update(data).then(
                function () {
                    $('#editModal').modal("hide");
                    self.getLayouts();
                },
                function () {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('LayoutController', LayoutController);
}