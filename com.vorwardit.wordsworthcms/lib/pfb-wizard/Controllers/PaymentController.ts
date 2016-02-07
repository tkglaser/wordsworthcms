module pfb.Controllers {
    class PaymentController {
        static $inject = ['$location', '$routeParams', 'BookingService'];
        constructor(
            private locationService: ng.ILocationService,
            private routeParamsService: ng.route.IRouteParamsService,
            private bookingService: Services.IBookingService
        ) {
            if (this.locationService.path().lastIndexOf('/payment/', 0) === 0) {
                this.bookingService.pay({
                    requestId: this.routeParamsService["requestId"],
                    paymentId: this.routeParamsService["paymentId"],
                    result: this.routeParamsService["result"]
                }).then(
                    (result) => {
                        this.locationService.path('/booking/' + this.routeParamsService["requestId"]);
                    },
                    (error) => {
                        this.locationService.path('/offer/' + this.routeParamsService["requestId"] + '/' + this.routeParamsService["offerId"]);
                    });
            }
        }
    }
    angular.module('pfb').controller('PaymentController', PaymentController);
}