app.controller('OfferExpiredController', [
    '$scope', '$routeParams', '$window', '$log', '$sce',
    '$location', 'requestFactory', 'request', 'analyticsFactory',
function ($scope, $routeParams, $window, $log, $sce, $location, requestFactory, request, analytics) {
    $scope.request = request.data;
    $scope.requestId = $routeParams.requestId;
    $scope.success = false;
    $location.search('r', null);
    $location.search('s', null);

    $scope.$on('$viewContentLoaded', function (event) {
        analytics.pageView('/app/offerexpired');
    });

    $("body,html").scrollTop(0);
}]);