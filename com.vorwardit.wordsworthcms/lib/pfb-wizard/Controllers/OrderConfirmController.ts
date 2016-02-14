module pfb.Controllers {
    class OrderConfirmController {

        offerId: number;
        requestId: string;
        request: Models.IRequest;
        offer: Models.IOffer;
        name: string;
        reserve: any = {};
        paymode: string;
        redirecting: boolean = false;
        submitted: boolean = false;
        accepted: boolean = false;

        static $inject = ['$routeParams', '$sce', '$log', '$window', 'BookingService', 'request', 'offer'];
        constructor(
            private routeParamsService: ng.route.IRouteParamsService,
            private sceService: ng.ISCEService,
            private logService: ng.ILogService,
            private windowService: ng.IWindowService,
            private bookingService: Services.IBookingService,
            request: any,
            offer: any
        ) {
            this.offer = offer;
            this.request = request;
            this.name = this.request.name;
            this.requestId = this.routeParamsService["requestId"];
            this.offerId = this.routeParamsService["offerId"];
            this.paymode = this.routeParamsService["paymode"];

            // TODO
            //$scope.$on('$viewContentLoaded', function (event) {
            //    analytics.pageView('/app/orderconfirm');
            //});

            this.offer.safeProductDescription = this.sceService.trustAsHtml(this.offer.productDescription);

            $("body,html").scrollTop(0);
        }

        acceptedStyle(): any {
            if (!this.submitted) {
                return '';
            }
            if (!this.accepted) {
                return ['has-error', 'emphasised'];
            } else {
                return 'has-success';
            }
        };

        submit(): void {
            this.submitted = true;
            if (this.accepted) {
                $("body,html").scrollTop(0);
                this.redirecting = true;
                this.bookingService.book({
                    RequestId: this.requestId,
                    OfferId: this.offerId,
                    PayMode: this.paymode
                }).then(
                    (result) => {
                        this.logService.info(result);
                        if (result.result == 'Redirect') {
                            this.windowService.location.href = result.data;
                        }
                    },
                    (error) => {
                        // TODO
                    });
            }
        };
    }
    angular.module('pfb').controller('OrderConfirmController', OrderConfirmController);
}