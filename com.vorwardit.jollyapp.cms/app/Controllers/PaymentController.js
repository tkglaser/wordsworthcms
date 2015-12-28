app.controller('PaymentController', ['$scope', '$routeParams', '$location', '$log', 'requestFactory', 'bookingFactory',
function ($scope, $routeParams, $location, $log, requestFactory, bookingFactory) {
    if ($location.path().lastIndexOf('/payment/', 0) === 0) {
        bookingFactory.pay({
            RequestId: $routeParams.requestId,
            PaymentId: $routeParams.paymentId,
            Result: $routeParams.result
        }).success(function (data) {
            $location.path('/booking/' + $routeParams.requestId);
        }).error(function (data) {
            $location.path('/offer/' + $routeParams.requestId + '/' + $routeParams.offerId);
        })
    }
}]);