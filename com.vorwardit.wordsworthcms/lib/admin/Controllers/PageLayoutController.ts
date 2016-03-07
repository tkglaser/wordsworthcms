declare var CodeMirror: any;

module app.controllers {
    class PageLayoutController {

        editor: any;

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        layouts: app.domain.ILayout[];

        pagelayouts: app.domain.IPageLayout[];
        pagelayout: app.domain.IPageLayout;

        static modalHeadingNew: string = 'Create New Page Layout';
        static modalHeadingEdit: string = 'Edit Page Layout';
        modalHeading: string;

        static $inject = ['LayoutService', 'PageLayoutService', 'SiteService'];
        constructor(
            private LayoutService: app.services.ILayoutService,
            private PageLayoutService: app.services.IPageLayoutService,
            private SiteService: app.services.ISiteService) {

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
            this.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditorPageLayout"), {
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

        getData(): void {
            this.SiteService.getData().then(
                (sites) => {
                    this.sites = sites;
                    this.site = this.SiteService.getSelectedSite(sites);
                    this.PageLayoutService.getBySiteId(this.site.siteId).then(
                        (pageLayouts) => {
                            this.pagelayouts = pageLayouts;
                        }
                    );
                    this.LayoutService.getBySiteId(this.site.siteId).then(
                        (layouts) => {
                            this.layouts = layouts;
                        }
                    );
                });
        };

        siteChanged(): void {
            this.SiteService.setSelectedSite(this.site);
            this.PageLayoutService.getBySiteId(this.site.siteId).then(
                (pageLayouts) => {
                    this.pagelayouts = pageLayouts;
                }
            );
            this.LayoutService.getBySiteId(this.site.siteId).then(
                (layouts) => {
                    this.layouts = layouts;
                }
            );
        };

        create(): void {
            $('#saveError').hide();
            this.modalHeading = PageLayoutController.modalHeadingNew;
            this.pagelayout = {
                pageLayoutId: '',
                layoutId: '',
                name: '',
                body: ''
            };
            this.editor.setValue('');
            setTimeout(() => {
                this.editor.refresh();
            }, 200);
            $('#editModal').modal();
        };

        edit(pagelayout: app.domain.IPageLayout): void {
            this.PageLayoutService.getData(pagelayout.pageLayoutId).then(
                (pagelayout) => {
                    this.pagelayout = pagelayout;
                    $('#saveError').hide();
                    this.modalHeading = PageLayoutController.modalHeadingEdit;
                    this.editor.setValue(this.pagelayout.body);
                    setTimeout(() => {
                        this.editor.refresh();
                    }, 200);
                    $('#editModal').modal();
                });
        };

        delete(pagelayout: app.domain.IPageLayout): void {
            $('#deleteError').hide();
            this.pagelayout = pagelayout;
            $('#deleteModal').modal();
        }

        deleteConfirmed(): void {
            this.PageLayoutService.remove(this.pagelayout.pageLayoutId).then(
                () => {
                    $('#deleteModal').modal('hide');
                    this.getData();
                },
                () => {
                    $('#deleteError').show();
                })
        }

        save(): void {
            this.pagelayout.body = this.editor.getValue();
            this.PageLayoutService.update(this.pagelayout).then(
                () => {
                    $('#editModal').modal("hide");
                    this.getData();
                },
                () => {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('PageLayoutController', PageLayoutController);
}