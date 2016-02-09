var pfb;
(function (pfb) {
    var Config = (function () {
        function Config(routeProvider, locationProvider) {
            this.routeProvider = routeProvider;
            this.locationProvider = locationProvider;
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
                    offer: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.offer($route.current.params.requestId, $route.current.params.offerId);
                        }],
                    request: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.get($route.current.params.requestId);
                        }]
                }
            })
                .when('/orderconfirm/:requestId/:offerId/:paymode', {
                templateUrl: '/views/OrderConfirm.html',
                controller: 'OrderConfirmController as ctrl',
                resolve: {
                    offer: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.offer($route.current.params.requestId, $route.current.params.offerId);
                        }],
                    request: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.get($route.current.params.requestId);
                        }]
                }
            })
                .when('/booking/:requestId', {
                templateUrl: '/views/Booking.html',
                controller: 'BookingController as ctrl',
                resolve: {
                    request: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.get($route.current.params.requestId);
                        }]
                }
            })
                .when('/cannotQuote/:requestId', {
                templateUrl: '/views/CannotQuote.html',
                controller: 'CannotQuoteController as ctrl',
                resolve: {
                    request: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.get($route.current.params.requestId);
                        }]
                }
            })
                .when('/offerExpired/:requestId', {
                templateUrl: '/views/OfferExpired.html',
                controller: 'OfferExpiredController as ctrl',
                resolve: {
                    request: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.get($route.current.params.requestId);
                        }]
                }
            })
                .when('/specialRequest/:requestId', {
                templateUrl: '/views/SpecialRequest.html',
                controller: 'SpecialRequestController as ctrl',
                resolve: {
                    request: ['requestFactory', '$route', function (requestFactory, $route) {
                            return requestFactory.get($route.current.params.requestId);
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
        Config.$inject = ['$routeProvider', '$locationProvider'];
        return Config;
    })();
    var app = angular.module('pfb', ['pfb-views', 'ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.date']);
    app.config(Config);
})(pfb || (pfb = {}));
