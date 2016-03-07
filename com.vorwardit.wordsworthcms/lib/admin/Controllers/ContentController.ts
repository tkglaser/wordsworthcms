module app.controllers {
    class ContentController {

        sites: app.domain.ISite[] = [];
        site: app.domain.ISite;

        contents: app.domain.IContent[] = [];
        content: app.domain.IContent;

        static modalHeadingNew = 'Create New Content';
        static modalHeadingEdit = 'Edit Content';
        modalHeading: string;

        static $inject = ['ContentService', 'SiteService'];
        constructor(private ContentService: app.services.IContentService, private SiteService: app.services.ISiteService) {
            this.getData();
        }

        getData(): void {
            this.SiteService.getData().then(
                (sites) => {
                    this.sites = sites;
                    this.site = this.SiteService.getSelectedSite(sites);
                    this.ContentService.getBySiteId(this.site.siteId).then(
                        (contents) => {
                            this.contents = contents;
                        });
                });
        };

        siteChanged(): void {
            this.SiteService.setSelectedSite(this.site);
            this.ContentService.getBySiteId(this.site.siteId).then(
                (data) => {
                    this.contents = data;
                });
        };

        delete(content: app.domain.IContent): void {
            $('#deleteError').hide();
            this.content = content;
            $('#deleteModal').modal();
        }

        deleteConfirmed(): void {
            this.ContentService.remove(this.content.contentId).then(
                () => {
                    $('#deleteModal').modal('hide');
                    this.getData();
                },
                () => {
                    $('#deleteError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('ContentController', ContentController);
}