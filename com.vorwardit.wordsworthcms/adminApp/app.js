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
                controller: 'SiteController as ctrl'
            })
            .when('/layouts', {
                templateUrl: 'adminApp/Views/Layouts.html',
                controller: 'LayoutController as ctrl'
            })
            .when('/pagelayouts', {
                templateUrl: 'adminApp/Views/PageLayouts.html',
                controller: 'PageLayoutController as ctrl'
            })
            .when('/pages', {
                templateUrl: 'adminApp/Views/Pages.html',
                controller: 'PageController as ctrl'
            })
            .when('/assets', {
                templateUrl: 'adminApp/Views/Assets.html',
                controller: 'AssetController as ctrl'
            })
            .when('/content', {
                templateUrl: 'adminApp/Views/Content.html',
                controller: 'ContentController as ctrl'
            })
            .when('/users', {
                templateUrl: 'adminApp/Views/Users.html',
                controller: 'UserController as ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }]);
})();
