(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngAnimate',
        'ngRoute'

        // Custom modules

        // 3rd Party Modules
        
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'adminApp/Views/Welcome.html',
                controller: 'WelcomeController'
            })
            .when('/sites', {
                reloadOnSearch: false,
                templateUrl: 'adminApp/Views/Sites.html',
                controller: 'SitesController as ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }]);
})();
