app.directive("headerHider", ['$window', function ($window) {
    return function (scope, element, attrs) {
        angular.element($window).bind('scroll', function () {
            if (this.pageYOffset > 10) {
                scope.showHeader = true;
            } else {
                scope.showHeader = false;
            }
            scope.$apply();
        })
    }
}])