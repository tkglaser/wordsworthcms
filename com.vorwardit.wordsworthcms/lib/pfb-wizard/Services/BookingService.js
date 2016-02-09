var pfb;
(function (pfb) {
    var Services;
    (function (Services) {
        var BookingService = (function () {
            function BookingService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            BookingService.prototype.book = function (data) {
                return this.httpService.post(PFBConfig.apiEndpoint + 'booking', data);
            };
            BookingService.prototype.pay = function (data) {
                return this.httpService.post(PFBConfig.apiEndpoint + 'paymentresult', data);
            };
            BookingService.$inject = ['$http', '$q'];
            return BookingService;
        })();
        angular.module('pfb').service('BookingService', BookingService);
    })(Services = pfb.Services || (pfb.Services = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=BookingService.js.map