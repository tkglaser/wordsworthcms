module app.controllers {
    class ContentEditController {

        sites: app.domain.ISite[] = [];
        site: app.domain.ISite;

        content: app.domain.IContent;

        static $inject = ['$routeParams', '$location', 'ContentService', 'SiteService'];
        constructor(
            private RouteParamsService: angular.route.IRouteParamsService,
            private LocationService: ng.ILocationService,
            private ContentService: app.services.IContentService,
            private SiteService: app.services.ISiteService) {
            var contentIdStr = RouteParamsService["id"];

            var contentId: number;
            if (contentIdStr == 'new') {
                contentId = -1;
            } else {
                contentId = parseInt(contentIdStr);
            }
            this.getContent(contentId);
        }

        getContent(id: number): void {
            this.SiteService.getData().then(
                (sites) => {
                    this.sites = sites;
                    this.site = this.SiteService.getSelectedSite(sites);
                    if (id == -1) {
                        this.content = {
                            contentId: -1,
                            siteId: this.site.siteId,
                            url: '',
                            body: ''
                        };
                    } else {
                        this.ContentService.getData(id).then((data) => {
                            this.content = data;
                        });
                    }
                });
        }

        save(): void {
            this.ContentService.update(this.content).then(
                () => {
                    this.LocationService.path('/content');
                },
                () => {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('ContentEditController', ContentEditController);
}