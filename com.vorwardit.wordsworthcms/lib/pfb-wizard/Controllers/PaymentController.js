var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var PaymentController = (function () {
            function PaymentController(locationService, routeParamsService, bookingService) {
                var _this = this;
                this.locationService = locationService;
                this.routeParamsService = routeParamsService;
                this.bookingService = bookingService;
                if (this.locationService.path().lastIndexOf('/payment/', 0) === 0) {
                    this.bookingService.pay({
                        requestId: this.routeParamsService["requestId"],
                        paymentId: this.routeParamsService["paymentId"],
                        result: this.routeParamsService["result"]
                    }).then(function (result) {
                        _this.locationService.path('/booking/' + _this.routeParamsService["requestId"]);
                    }, function (error) {
                        _this.locationService.path('/offer/' + _this.routeParamsService["requestId"] + '/' + _this.routeParamsService["offerId"]);
                    });
                }
            }
            PaymentController.$inject = ['$location', '$routeParams', 'BookingService'];
            return PaymentController;
        })();
        angular.module('pfb').controller('PaymentController', PaymentController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=PaymentController.js.map