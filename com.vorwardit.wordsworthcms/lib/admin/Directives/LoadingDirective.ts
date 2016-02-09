module app.directives {

    export interface ILoadingDirectiveScope extends ng.IScope {
        isLoading: (() => boolean);
        timer: ng.IPromise<void>
    }

    LoadingDirective.$inject = ['$http', '$window', '$timeout'];
    function LoadingDirective(
        $http: ng.IHttpService,
        $window: ng.IWindowService,
        $timeout: ng.ITimeoutService
    ): ng.IDirective {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope: ILoadingDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
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

    angular
        .module('app')
        .directive('loading', LoadingDirective);
}
