module pfb.Controllers {
    class OfferExpiredController {

        requestId: string;
        request: Models.IRequest;
        success: boolean = false;

        static $inject = ['$location', '$routeParams', 'request'];
        constructor(
            private locationService: ng.ILocationService,
            private routeParamsService: ng.route.IRouteParamsService,
            request: any
        ) {
            this.request = request.data;
            this.requestId = this.routeParamsService["requestId"];
            this.locationService.search('r', null);
            this.locationService.search('s', null);

            // TODO: analytics
            $("body,html").scrollTop(0);
        }
    }
    angular.module('pfb').controller('OfferExpiredController', OfferExpiredController);
}