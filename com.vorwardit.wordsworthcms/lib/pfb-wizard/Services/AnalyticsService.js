var pfb;
(function (pfb) {
    var Services;
    (function (Services) {
        var AnalyticsService = (function () {
            function AnalyticsService(windowService, locationService, logService) {
                this.windowService = windowService;
                this.locationService = locationService;
                this.logService = logService;
            }
            AnalyticsService.prototype.pageview = function (page) {
                if (page) {
                    this.windowService["ga"]('send', 'pageview', { page: page });
                }
                else {
                    this.windowService["ga"]('send', 'pageview', { page: this.locationService.url() });
                }
            };
            AnalyticsService.prototype.buttonclick = function (label) {
                this.windowService["ga"]('send', 'event', 'button', 'click', label);
            };
            AnalyticsService.prototype.offersdisplayed = function () {
                this.windowService["ga"]('send', 'event', 'quotation', 'display', 'offers');
            };
            AnalyticsService.$inject = ['$window', '$location', '$log'];
            return AnalyticsService;
        })();
        angular.module('pfb')
            .service('AnalyticsService', AnalyticsService);
    })(Services = pfb.Services || (pfb.Services = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=AnalyticsService.js.map