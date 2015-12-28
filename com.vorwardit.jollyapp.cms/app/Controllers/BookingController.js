app.controller('BookingController', [
    '$scope', '$routeParams', '$window', '$log', '$sce', '$timeout',
    '$location', 'requestFactory', 'bookingFactory', 'mailerFactory', 'request', 'analyticsFactory',
function ($scope, $routeParams, $window, $log, $sce, $timeout, $location, requestFactory, bookingFactory, mailerFactory, request, analytics) {
    $scope.request = request.data;
    $scope.requestId = $routeParams.requestId;
    $scope.isMailFormShown = false;
    $scope.emailForSending = $scope.request.email;
    $scope.emailBeingSent = false;
    $scope.mailSendSuccess = false;

    $scope.$on('$viewContentLoaded', function (event) {
        analytics.pageView('/app/booking');
    });

    $scope.request.safeProductDescription = $sce.trustAsHtml($scope.request.productDescription);

    $scope.print = function () {
        $window.print();
    };

    $scope.showMailForm = function () {
        $scope.isMailFormShown = true;
    }

    $scope.sendMail = function () {
        $scope.emailBeingSent = true;

        mailerFactory.sendMail({
            Id: $scope.requestId,
            Type: 'orderconfirmation',
            Email: $scope.emailForSending
        }).success(function () {
            $scope.emailBeingSent = false;
            $scope.mailSendSuccess = true;
            $timeout(function () {
                $scope.mailSendSuccess = false;
                $scope.isMailFormShown = false;
            }, 2000);
        });
    }

    $("body,html").scrollTop(0);
}]);