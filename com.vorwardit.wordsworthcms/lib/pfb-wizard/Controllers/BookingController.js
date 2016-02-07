var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var BookingController = (function () {
            function BookingController(routeParamsService, windowService, sceService, timeOutService, mailerService, 
                //private analyticsService: Services.IAnalyticsService,
                request) {
                this.routeParamsService = routeParamsService;
                this.windowService = windowService;
                this.sceService = sceService;
                this.timeOutService = timeOutService;
                this.mailerService = mailerService;
                this.request = request;
                this.isMailFormShown = false;
                this.emailBeingSent = false;
                this.mailSendSuccess = false;
                this.requestId = routeParamsService["requestId"];
                this.emailForSending = request.email;
                // todo: analytics pageload
                this.request.safeProductDescription = this.sceService.trustAsHtml(this.request.productDescription);
                $("body,html").scrollTop(0);
            }
            BookingController.prototype.print = function () {
                this.windowService.print();
            };
            ;
            BookingController.prototype.showMailForm = function () {
                this.isMailFormShown = true;
            };
            BookingController.prototype.sendMail = function () {
                var _this = this;
                this.emailBeingSent = true;
                this.mailerService.sendMail({
                    Id: this.requestId,
                    Type: 'orderconfirmation',
                    Email: this.emailForSending
                }).then(function (result) {
                    _this.emailBeingSent = false;
                    _this.mailSendSuccess = true;
                    _this.timeOutService(function () {
                        _this.mailSendSuccess = false;
                        _this.isMailFormShown = false;
                    }, 2000);
                }, function (error) {
                    // TODO
                });
            };
            BookingController.$inject = ['$routeParams', '$window', '$sce', '$timeout', 'MailerService', 'request'];
            return BookingController;
        })();
        angular.module('pfb').controller('BookingController', BookingController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=BookingController.js.map