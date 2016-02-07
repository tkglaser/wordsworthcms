module pfb.Controllers {
    class SpecialRequestController {

        requestId: string;
        request: Models.IRequest;
        success: boolean = false;
        SpecialRequests: string;

        static $inject = ['$routeParams', 'RequestService', 'request'];
        constructor(
            private routeParamsService: ng.route.IRouteParamsService,
            private requestService: Services.IRequestService,
            request: any
        ) {
            this.request = request.data;
            this.requestId = this.routeParamsService["requestId"];

            // TODO: Analytics
            //$scope.$on('$viewContentLoaded', function (event) {
            //    analytics.pageView('/app/specialrequest');
            //});
            $("body,html").scrollTop(0);
        }

        submit(): void {
            $("body,html").scrollTop(0);
            this.requestService.update({
                requestId: this.requestId,
                hasSpecialRequests: true,
                specialRequests: this.SpecialRequests
            }).then(
                () => {
                    this.success = true;
                },
                () => {
                    // TODO
                });
        };
    }
    angular.module('pfb').controller('SpecialRequestController', SpecialRequestController);
}