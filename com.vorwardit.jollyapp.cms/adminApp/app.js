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
                templateUrl: 'adminApp/Views/Sites.html',
                controller: 'SitesController as ctrl'
            })
            .when('/layouts', {
                templateUrl: 'adminApp/Views/Layouts.html',
                controller: 'LayoutsController as ctrl'
            })
            .when('/pagelayouts', {
                templateUrl: 'adminApp/Views/PageLayouts.html',
                controller: 'PageLayoutsController as ctrl'
            })
            .when('/pages', {
                templateUrl: 'adminApp/Views/Pages.html',
                controller: 'PagesController as ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }]);
})();
