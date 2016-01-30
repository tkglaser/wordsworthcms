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
                templateUrl: 'lib/admin/Views/Welcome.html',
                controller: 'WelcomeController'
            })
            .when('/sites', {
                templateUrl: 'lib/admin/Views/Sites.html',
                controller: 'SiteController as ctrl'
            })
            .when('/layouts', {
                templateUrl: 'lib/admin/Views/Layouts.html',
                controller: 'LayoutController as ctrl'
            })
            .when('/pagelayouts', {
                templateUrl: 'lib/admin/Views/PageLayouts.html',
                controller: 'PageLayoutController as ctrl'
            })
            .when('/pages', {
                templateUrl: 'lib/admin/Views/Pages.html',
                controller: 'PageController as ctrl'
            })
            .when('/assets', {
                templateUrl: 'lib/admin/Views/Assets.html',
                controller: 'AssetController as ctrl'
            })
            .when('/content', {
                templateUrl: 'lib/admin/Views/Content.html',
                controller: 'ContentController as ctrl'
            })
            .when('/users', {
                templateUrl: 'lib/admin/Views/Users.html',
                controller: 'UserController as ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }]);
})();
