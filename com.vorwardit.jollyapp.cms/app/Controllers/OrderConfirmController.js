app.controller('OrderConfirmController', [
    '$scope', '$routeParams', '$window', '$log', '$sce',
    '$location', 'bookingFactory', 'offer', 'request', 'analyticsFactory',
function ($scope, $routeParams, $window, $log, $sce, $location, bookingFactory, offer, request, analytics) {
    $scope.offer = offer.data;
    $scope.request = request.data;
    $scope.name = $scope.request.name;
    $scope.requestId = $routeParams.requestId;
    $scope.offerId = $routeParams.offerId;
    $scope.reserve = {};
    $scope.paymode = $routeParams.paymode;
    $scope.redirecting = false;
    $scope.submitted = false;
    $scope.accepted = false;

    $scope.$on('$viewContentLoaded', function (event) {
        analytics.pageView('/app/orderconfirm');
    });

    $scope.offer.safeProductDescription = $sce.trustAsHtml($scope.offer.productDescription);

    $("body,html").scrollTop(0);

    $scope.acceptedStyle = function () {
        if (!$scope.submitted) {
            return '';
        }
        if (!$scope.accepted) {
            return ['has-error', 'emphasised'];
        } else {
            return 'has-success';
        }
    };

    $scope.submit = function () {
        $scope.submitted = true;
        if ($scope.accepted) {
            $("body,html").scrollTop(0);
            $scope.redirecting = true;
            bookingFactory.book({
                RequestId: $scope.requestId,
                OfferId: $scope.offerId,
                PayMode: $scope.paymode
            }).success(function (data) {
                $log.info(data);
                if (data.result == 'Redirect') {
                    $window.location.href = data.data;
                }
            });
        }
    };
}]);