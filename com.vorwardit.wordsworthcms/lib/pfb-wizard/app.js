var app = angular.module('RequestApp', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ui.date']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            reloadOnSearch: false,
            templateUrl: 'lib/pfb-wizard/Views/Landing.html',
            controller: 'LandingController'
        })
        .when('/von-:startSearch', {
            reloadOnSearch: false,
            templateUrl: 'lib/pfb-wizard/Views/Landing.html',
            controller: 'LandingController'
        })
        .when('/nach-:targetSearch', {
            reloadOnSearch: false,
            templateUrl: 'lib/pfb-wizard/Views/Landing.html',
            controller: 'LandingController'
        })
        .when('/von-:startSearch/nach-:targetSearch', {
            reloadOnSearch: false,
            templateUrl: 'lib/pfb-wizard/Views/Landing.html',
            controller: 'LandingController'
        })
        .when('/request', {
            reloadOnSearch: false,
            templateUrl: 'lib/pfb-wizard/Views/Request.html',
            controller: 'RequestController'
        })
        .when('/order/:requestId/:offerId', {
            templateUrl: 'lib/pfb-wizard/Views/Order.html',
            controller: 'OrderController',
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
            templateUrl: 'lib/pfb-wizard/Views/OrderConfirm.html',
            controller: 'OrderConfirmController',
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
            templateUrl: 'lib/pfb-wizard/Views/Booking.html',
            controller: 'BookingController',
            resolve: {
                request: ['requestFactory', '$route', function (requestFactory, $route) {
                    return requestFactory.get($route.current.params.requestId);
                }]
            }
        })
        .when('/cannotQuote/:requestId', {
            templateUrl: 'lib/pfb-wizard/Views/CannotQuote.html',
            controller: 'CannotQuoteController',
            resolve: {
                request: ['requestFactory', '$route', function (requestFactory, $route) {
                    return requestFactory.get($route.current.params.requestId);
                }]
            }
        })
        .when('/offerExpired/:requestId', {
            templateUrl: 'lib/pfb-wizard/Views/OfferExpired.html',
            controller: 'OfferExpiredController',
            resolve: {
                request: ['requestFactory', '$route', function (requestFactory, $route) {
                    return requestFactory.get($route.current.params.requestId);
                }]
            }
        })
        .when('/specialRequest/:requestId', {
            templateUrl: 'lib/pfb-wizard/Views/SpecialRequest.html',
            controller: 'SpecialRequestController',
            resolve: {
                request: ['requestFactory', '$route', function (requestFactory, $route) {
                    return requestFactory.get($route.current.params.requestId);
                }]
            }
        })
        .when('/payment/:result/:requestId/:paymentId/:offerId', {
            templateUrl: 'lib/pfb-wizard/Views/Processing.html',
            controller: 'PaymentController'
        })
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);

//app.constant('apiEndPoint', 'http://api.paulfaehrtbus.com/api/'); // LIVE
app.constant('apiEndPoint', PFBConfig.apiEndpoint);// 'http://beta-paulfaehrtbus-api.azurewebsites.net/api/'); // BETA
app.constant('clientId', PFBConfig.clientId);// '48264997-05be-4141-b112-bbe5ba58a3bb'); // PAUL
