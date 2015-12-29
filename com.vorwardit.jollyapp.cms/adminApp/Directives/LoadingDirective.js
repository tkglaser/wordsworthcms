(function() {
    'use strict';

    angular
        .module('app')
        .directive('loading', LoadingDirective);

    LoadingDirective.$inject = ['$http', '$window'];
    
    function LoadingDirective ($http, $window) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    element.fadeIn();
                } else {
                    element.fadeOut();
                }
            });
        }
    }

})();
