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
                this.windowService["ga"]('send', 'pageview', { page: page });
            } else {
                this.windowService["ga"]('send', 'pageview', { page: this.locationService.url() });
            }
        }

        buttonclick(label: string): void {
            this.windowService["ga"]('send', 'event', 'button', 'click', label);
        }

        offersdisplayed(): void {
            this.windowService["ga"]('send', 'event', 'quotation', 'display', 'offers');
        }
    }

    angular.module('pfb')
        .service('AnalyticsService', AnalyticsService);
}