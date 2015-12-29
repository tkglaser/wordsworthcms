(function() {
    'use strict';

    angular
        .module('app')
        .directive('activeLink', ActiveLinkDirective);

    ActiveLinkDirective.$inject = ['$window', '$location'];
    
    function ActiveLinkDirective ($window, $location) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var clazz = 'active';
            var path = attrs.activeLink;
            scope.location = $location;
            scope.$watch('location.path()', function (newPath) {
                debugger;
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    }

})();
