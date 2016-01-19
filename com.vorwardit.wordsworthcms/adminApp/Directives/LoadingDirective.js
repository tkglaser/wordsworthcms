(function() {
    'use strict';

    angular
        .module('app')
        .directive('loading', LoadingDirective);

    LoadingDirective.$inject = ['$http', '$window', '$timeout'];
    
    function LoadingDirective($http, $window, $timeout) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.timer = null;

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    scope.timer = $timeout(function () {
                        element.fadeIn(100);
                        scope.timer = null;
                    }, 300);
                } else {
                    if (scope.timer != null) {
                        $timeout.cancel(scope.timer);
                    }
                    element.fadeOut(100);
                }
            });
        }
    }

})();
