module pfb.Controllers {
    class CannotQuoteController {

        requestId: string;
        request: Models.IRequest;
        Name: string;
        EMail: string;
        success: boolean = false;

        static $inject = ['$routeParams', 'RequestService', 'request'];
        constructor(
            private routeParamsService: ng.route.IRouteParamsService,
            private requestService: Services.IRequestService,
            request: any
        ) {
            this.request = request.data;
            this.requestId = this.routeParamsService["requestId"];

            // TODO: Analytics
            $("body,html").scrollTop(0);
        };

        submit() {
            $("body,html").scrollTop(0);
            this.requestService.update({
                requestId: this.requestId,
                name: this.Name,
                email: this.EMail
            }).then(
                () => {
                    this.success = true;
                },
                () => { });
        };
    }
    angular.module('pfb').controller('CannotQuoteController', CannotQuoteController);
}