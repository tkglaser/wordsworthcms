app.directive('viewportHeight', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return { 'h': w.height(), 'w': w.width() };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function () {
                    if (newValue.w < 768) {
                        return {};
                    }
                    else {
                        return {
                            'padding-top': (newValue.h - 700) / 2,//140)/6,
                            'height': (newValue.h - 140) + 'px'//,
                            //'width': (newValue.w - 100) + 'px'
                        };
                    }
                };

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    };
}])