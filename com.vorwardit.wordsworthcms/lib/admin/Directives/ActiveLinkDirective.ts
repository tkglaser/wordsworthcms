module app.directives {

    export interface IActiveLinkScope extends ng.IScope {
        location: ng.ILocationService
    }

    ActiveLinkDirective.$inject = ['$window', '$location'];
    function ActiveLinkDirective(
        $window: ng.IWindowService,
        $location: ng.ILocationService): ng.IDirective {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope: IActiveLinkScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
            var clazz = 'active';
            var path = attrs["activeLink"];
            scope.location = $location;
            scope.$watch('location.path()', function (newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    }

    angular
        .module('app')
        .directive('activeLink', ActiveLinkDirective);
}
