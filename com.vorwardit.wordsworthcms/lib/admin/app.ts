module app {
    class Config {
        constructor($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
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
                .when('/layouts/:id', {
                    templateUrl: 'lib/admin/Views/LayoutEdit.html',
                    controller: 'LayoutEditController as ctrl'
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
                .when('/content/:id', {
                    templateUrl: 'lib/admin/Views/ContentEdit.html',
                    controller: 'ContentEditController as ctrl'
                })
                .when('/users', {
                    templateUrl: 'lib/admin/Views/Users.html',
                    controller: 'UserController as ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
            //$locationProvider.html5Mode(true);

        }
    }

    Config.$inject = ['$routeProvider', '$locationProvider'];

    var mainApp = angular.module('app', ['ngAnimate', 'ngRoute']);
    mainApp.config(Config);
}