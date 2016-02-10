module app.controllers {
    class PageController {

        static modalHeadingNew = 'Neue Seite anlegen';
        static modalHeadingEdit = 'Seite bearbeiten';
        modalHeading: string;
        pages: app.domain.IPage[] = [];
        page: app.domain.IPage;
        pageversions: app.domain.IPageVersion[] = [];
        pageversion: app.domain.IPageVersion;
        pageLayouts: app.domain.IPageLayout[] = [];
        sites: app.domain.ISite[] = [];
        site: app.domain.ISite;

        static $inject = ['PageService', 'SiteService', 'PageLayoutService'];
        constructor(
            private PageService: app.services.IPageService,
            private SiteService: app.services.ISiteService,
            private PageLayoutService: app.services.IPageLayoutService
        ) {
            this.getData();
        }

        getData(): void {
            this.SiteService.getData().then(
                (data) => {
                    this.sites = data;
                    this.site = this.SiteService.getSelectedSite(data);
                    this.PageService.getBySiteId(this.site.siteId).then(
                        (data) => {
                            this.pages = data;
                        }
                    );
                    this.PageLayoutService.getBySiteId(this.site.siteId).then(
                        (data) => {
                            this.pageLayouts = data;
                        }
                    );
                });
        };

        siteChanged(): void {
            this.SiteService.setSelectedSite(this.site);
            this.PageService.getBySiteId(this.site.siteId).then(
                (data) => {
                    this.pages = data;
                });
            this.PageLayoutService.getBySiteId(this.site.siteId).then(
                (data) => {
                    this.pageLayouts = data;
                });
        };

        create(): void {
            $('#saveError').hide();
            this.modalHeading = PageController.modalHeadingNew;
            this.page = {
                pageId: '',
                pageLayoutId: '',
                name: '',
                urls: [{ url: '', pageUrlId: -1 }]
            };
            $('#editModal').modal();
        };

        edit(page: app.domain.IPage): void {
            this.PageService.getData(page.pageId).then(
                (data) => {
                    $('#saveError').hide();
                    this.modalHeading = PageController.modalHeadingEdit;
                    this.page = data;
                    $('#editModal').modal();
                });
        };

        editContent(page: app.domain.IPage): void {
            $('#saveContentError').hide();
            this.PageService.getVersions(page.pageId).then(
                (data) => {
                    if (data.length > 0) {
                        this.pageversion = data[0];
                    } else {
                        this.pageversion = {
                            pageId: page.pageId,
                            title: '',
                            metaDescription: ''
                        };
                    }
                    $('#editContentModal').modal();
                });
        }

        showVersions(page: app.domain.IPage): void {
            $('#publishError').hide();
            this.page = page;
            this.PageService.getVersions(page.pageId).then(
                (data) => {
                    this.pageversions = data;
                    $('#publishModal').modal();
                });
        }

        newVersion(): void {
            this.PageService.createNewVersion(this.page.pageId).then(
                () => {
                    this.PageService.getVersions(this.page.pageId).then(
                        (data) => {
                            this.pageversions = data;
                        });
                });
        }

        publish(versionId: string): void {
            this.PageService.publish(versionId).then(
                () => {
                    this.PageService.getVersions(this.page.pageId).then(
                        (data) => {
                            this.pageversions = data;
                        });
                },
                () => {
                    $('#publishError').show();
                });
        }

        addUrl(): void {
            this.page.urls.push({ pageUrlId: -1, url: '' });
        }

        removeUrl(url: app.domain.IPageUrl): void {
            var index = this.page.urls.indexOf(url);
            this.page.urls.splice(index, 1);
        }

        delete(page: app.domain.IPage): void {
            $('#deleteError').hide();
            this.page = page;
            $('#deleteModal').modal();
        }

        deleteConfirmed(): void {
            this.PageService.remove(this.page.pageId).then(
                () => {
                    $('#deleteModal').modal('hide');
                    this.getData();
                },
                () => {
                    $('#deleteError').show();
                })
        }

        save(): void {
            this.PageService.update(this.page).then(
                () => {
                    $('#editModal').modal("hide");
                    this.getData();
                },
                () => {
                    $('#saveError').show();
                });
        }

        saveVersion(): void {
            this.PageService.updateVersion(this.pageversion).then(
                () => {
                    $('#editContentModal').modal("hide");
                    this.getData();
                },
                () => {
                    $('#saveContentError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('PageController', PageController);
}