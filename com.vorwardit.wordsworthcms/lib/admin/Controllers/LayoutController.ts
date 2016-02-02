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
            this.SiteService.getData().then(
                (data) => {
                    this.sites = data;
                    this.site = this.SiteService.getSelectedSite(data);
                    this.LayoutService.getBySiteId(this.site.siteId).then(
                        (data) => {
                            this.layouts = data;
                        });
                });
        }

        siteChanged(): void {
            this.SiteService.setSelectedSite(this.site);
            this.LayoutService.getBySiteId(this.site.siteId).then(
                (data) => {
                    this.layouts = data;
                });
        };

        create(): void {
            $('#saveError').hide();
            this.modalHeading = LayoutController.modalHeadingNew;
            this.layout = new app.domain.Layout('', '', '', '');
            this.editor.setValue('');
            setTimeout(() => {
                this.editor.refresh();
            }, 200);
            $('#editModal').modal();
        };

        edit(layout: app.domain.ILayout): void {
            this.LayoutService.getData(layout.layoutId).then(
                (data) => {
                    $('#saveError').hide();
                    this.modalHeading = LayoutController.modalHeadingEdit;
                    this.layout = data;
                    this.editor.setValue(this.layout.body);
                    setTimeout(() => {
                        this.editor.refresh();
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
            this.LayoutService.remove(this.layout.layoutId).then(
                () => {
                    $('#deleteModal').modal('hide');
                    this.getLayouts();
                },
                () => {
                    $('#deleteError').show();
                })
        }

        save(): void {
            var data = new app.domain.Layout(
                this.layout.layoutId,
                this.layout.siteId,
                this.layout.name,
                this.editor.getValue());
            this.LayoutService.update(data).then(
                () => {
                    $('#editModal').modal("hide");
                    this.getLayouts();
                },
                () => {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('LayoutController', LayoutController);
}