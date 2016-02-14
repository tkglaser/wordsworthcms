module pfb.Services {

    export interface IAnalyticsService {
        pageview(page?: string): void;
        buttonclick(label: string): void;
        offersdisplayed(): void;
    }

    class AnalyticsService {
        static $inject = ['$window', '$location', '$log'];
        constructor(
            private windowService: ng.IWindowService,
            private locationService: ng.ILocationService,
            private logService: ng.ILogService) {
        }
        
        pageview(page?: string): void {
            if (page) {
                this.ga('send', 'pageview', { page: page });
            } else {
                this.ga('send', 'pageview', { page: this.locationService.url() });
            }
        }

        buttonclick(label: string): void {
            this.ga('send', 'event', 'button', 'click', label);
        }

        offersdisplayed(): void {
            this.ga('send', 'event', 'quotation', 'display', 'offers');
        }

        ga(a, b, c, d?, e?): void {
            if (typeof (this.windowService["ga"]) == "function") {
                this.windowService["ga"](a, b, c, d, e);
            }
        }
    }

    angular.module('pfb')
        .service('AnalyticsService', AnalyticsService);
}