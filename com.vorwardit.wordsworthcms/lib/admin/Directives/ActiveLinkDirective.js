var app;
(function (app) {
    var directives;
    (function (directives) {
        ActiveLinkDirective.$inject = ['$window', '$location'];
        function ActiveLinkDirective($window, $location) {
            var directive = {
                link: link,
                restrict: 'A'
            };
            return directive;
            function link(scope, element, attrs) {
                var clazz = 'active';
                var path = attrs["activeLink"];
                scope.location = $location;
                scope.$watch('location.path()', function (newPath) {
                    if (path === newPath) {
                        element.addClass(clazz);
                    }
                    else {
                        element.removeClass(clazz);
                    }
                });
            }
        }
        angular
            .module('app')
            .directive('activeLink', ActiveLinkDirective);
    })(directives = app.directives || (app.directives = {}));
})(app || (app = {}));
//# sourceMappingURL=ActiveLinkDirective.js.map