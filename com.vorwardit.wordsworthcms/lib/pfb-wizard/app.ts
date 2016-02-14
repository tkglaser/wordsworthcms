declare var PFBConfig: pfb.Models.IPFBConfig;

module pfb {
    class Config {
        static $inject = ['$routeProvider', '$locationProvider'];
        constructor(
            private routeProvider: ng.route.IRouteProvider,
            private locationProvider: ng.ILocationProvider
        ) {
            this.routeProvider
                .when('/', {
                    reloadOnSearch: false,
                    templateUrl: '/views/Landing.html',
                    controller: 'LandingController as ctrl'
                })
                .when('/von-:startSearch', {
                    reloadOnSearch: false,
                    templateUrl: '/views/Landing.html',
                    controller: 'LandingController as ctrl'
                })
                .when('/nach-:targetSearch', {
                    reloadOnSearch: false,
                    templateUrl: '/views/Landing.html',
                    controller: 'LandingController as ctrl'
                })
                .when('/von-:startSearch/nach-:targetSearch', {
                    reloadOnSearch: false,
                    templateUrl: '/views/Landing.html',
                    controller: 'LandingController as ctrl'
                })
                .when('/request', {
                    reloadOnSearch: false,
                    templateUrl: '/views/Request.html',
                    controller: 'RequestController as ctrl'
                })
                .when('/order/:requestId/:offerId', {
                    templateUrl: '/views/Order.html',
                    controller: 'OrderController as ctrl',
                    resolve: {
                        offer: ['requestService', '$route', function (requestService, $route) {
                            return requestService.offer($route.current.params.requestId, $route.current.params.offerId);
                        }],
                        request: ['requestService', '$route', function (requestService, $route) {
                            return requestService.get($route.current.params.requestId);
                        }]
                    }
                })
                .when('/orderconfirm/:requestId/:offerId/:paymode', {
                    templateUrl: '/views/OrderConfirm.html',
                    controller: 'OrderConfirmController as ctrl',
                    resolve: {
                        offer: ['requestService', '$route', function (requestService, $route) {
                            return requestService.offer($route.current.params.requestId, $route.current.params.offerId);
                        }],
                        request: ['requestService', '$route', function (requestService, $route) {
                            return requestService.get($route.current.params.requestId);
                        }]
                    }
                })
                .when('/booking/:requestId', {
                    templateUrl: '/views/Booking.html',
                    controller: 'BookingController as ctrl',
                    resolve: {
                        request: ['requestService', '$route', function (requestService, $route) {
                            return requestService.get($route.current.params.requestId);
                        }]
                    }
                })
                .when('/cannotQuote/:requestId', {
                    templateUrl: '/views/CannotQuote.html',
                    controller: 'CannotQuoteController as ctrl',
                    resolve: {
                        request: ['requestService', '$route', function (requestService, $route) {
                            return requestService.get($route.current.params.requestId);
                        }]
                    }
                })
                .when('/offerExpired/:requestId', {
                    templateUrl: '/views/OfferExpired.html',
                    controller: 'OfferExpiredController as ctrl',
                    resolve: {
                        request: ['requestService', '$route', function (requestService, $route) {
                            return requestService.get($route.current.params.requestId);
                        }]
                    }
                })
                .when('/specialRequest/:requestId', {
                    templateUrl: '/views/SpecialRequest.html',
                    controller: 'SpecialRequestController as ctrl',
                    resolve: {
                        request: ['requestService', '$route', function (requestService, $route) {
                            return requestService.get($route.current.params.requestId);
                        }]
                    }
                })
                .when('/payment/:result/:requestId/:paymentId/:offerId', {
                    templateUrl: '/views/Processing.html',
                    controller: 'PaymentController as ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
            if (PFBConfig.html5Routing && PFBConfig.html5Routing.valueOf()) {
                this.locationProvider.html5Mode(true);
            }
        }
    }

    var app = angular.module('pfb', ['pfb-views', 'ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.date']);
    app.config(Config);
}