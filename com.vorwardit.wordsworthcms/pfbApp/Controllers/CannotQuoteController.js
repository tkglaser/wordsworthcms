app.controller('CannotQuoteController', [
    '$scope', '$routeParams', '$window', '$log', '$sce',
    '$location', 'requestFactory', 'request', 'analyticsFactory',
function ($scope, $routeParams, $window, $log, $sce, $location, requestFactory, request, analytics) {
    $scope.request = request.data;
    $scope.requestId = $routeParams.requestId;
    $scope.success = false;

    $scope.$on('$viewContentLoaded', function (event) {
        analytics.pageView('/app/cannotquote');
    });

    $("body,html").scrollTop(0);

    $scope.submit = function () {
        $("body,html").scrollTop(0);
        requestFactory.update({
            RequestId: $scope.requestId,
            Name: $scope.Name,
            Email: $scope.EMail
        }).success(function () {
            $scope.success = true;
        }).error(function (data) {
        })
        ;
    };
}]);