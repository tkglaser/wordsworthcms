var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var OrderConfirmController = (function () {
            function OrderConfirmController(routeParamsService, sceService, logService, windowService, bookingService, request, offer) {
                this.routeParamsService = routeParamsService;
                this.sceService = sceService;
                this.logService = logService;
                this.windowService = windowService;
                this.bookingService = bookingService;
                this.reserve = {};
                this.redirecting = false;
                this.submitted = false;
                this.accepted = false;
                this.offer = offer.data;
                this.request = request.data;
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
            OrderConfirmController.prototype.acceptedStyle = function () {
                if (!this.submitted) {
                    return '';
                }
                if (!this.accepted) {
                    return ['has-error', 'emphasised'];
                }
                else {
                    return 'has-success';
                }
            };
            ;
            OrderConfirmController.prototype.submit = function () {
                var _this = this;
                this.submitted = true;
                if (this.accepted) {
                    $("body,html").scrollTop(0);
                    this.redirecting = true;
                    this.bookingService.book({
                        RequestId: this.requestId,
                        OfferId: this.offerId,
                        PayMode: this.paymode
                    }).then(function (result) {
                        _this.logService.info(result);
                        if (result.result == 'Redirect') {
                            _this.windowService.location.href = result.data;
                        }
                    }, function (error) {
                        // TODO
                    });
                }
            };
            ;
            OrderConfirmController.$inject = ['$routeParams', '$sce', '$log', '$window', 'BookingService', 'request', 'offer'];
            return OrderConfirmController;
        })();
        angular.module('pfb').controller('OrderConfirmController', OrderConfirmController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
