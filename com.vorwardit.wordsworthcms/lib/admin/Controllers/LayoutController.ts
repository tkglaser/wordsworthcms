declare var CodeMirror: any;

module app.controllers {
    class LayoutController {

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        layouts: app.domain.ILayout[];
        layout: app.domain.ILayout;

        static $inject = ['LayoutService', 'SiteService'];
        constructor(
            private LayoutService: app.services.ILayoutService,
            private SiteService: app.services.ISiteService)
        {
            this.getLayouts();
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
    }

    angular
        .module('app')
        .controller('LayoutController', LayoutController);
}