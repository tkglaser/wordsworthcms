module app.controllers {
    class ContentController {

        sites: app.domain.ISite[] = [];
        site: app.domain.ISite;

        contents: app.domain.IContent[] = [];
        content: app.domain.IContent;

        static modalHeadingNew = 'Neuen Content anlegen';
        static modalHeadingEdit = 'Content bearbeiten';
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

        create(): void {
            $('#saveError').hide();
            this.modalHeading = ContentController.modalHeadingNew;
            this.content = new app.domain.Content(-1, '', '', '');
            $('#editModal').modal();
        };

        edit(content: app.domain.IContent): void {
            this.ContentService.getData(content.contentId).then(
                (data) => {
                    $('#saveError').hide();
                    this.modalHeading = ContentController.modalHeadingEdit;
                    this.content = data;
                    $('#editModal').modal();
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

        save(): void {
            var data = new app.domain.Content(this.content.contentId, this.site.siteId, this.content.url, this.content.body);
            this.ContentService.update(data).then(
                () => {
                    $('#editModal').modal("hide");
                    this.getData();
                },
                () => {
                    $('#saveError').show();
                });
        }
    }
}