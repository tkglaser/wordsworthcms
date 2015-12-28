app.controller('OrderController', [
    '$scope', '$routeParams', '$window', '$log', '$location',
    '$sce', 'requestFactory', 'offer', 'request', 'analyticsFactory', 
function ($scope, $routeParams, $window, $log, $location, $sce, requestFactory, offer, request, analytics) {
    $scope.offer = offer.data;
    $scope.request = request.data;

    $scope.name = $scope.request.name;
    $scope.email = $scope.request.email;
    $scope.organisation = $scope.request.organisation;
    $scope.street = $scope.request.address;
    $scope.town = $scope.request.town;
    $scope.postcode = $scope.request.postcode;

    $scope.requestId = $routeParams.requestId;
    $scope.offerId = $routeParams.offerId;
    $scope.form = {};
    $scope.paymode = 'later';
    $scope.submitted = false;

    $scope.$on('$viewContentLoaded', function (event) {
        analytics.pageView('/app/order');
    });

    $scope.offer.safeProductDescription = $sce.trustAsHtml($scope.offer.productDescription);

    $("body,html").scrollTop(0);

    $scope.nameValidClass = function () {
        if (!$scope.form.name.$dirty && !$scope.submitted) {
            return '';
        }
        if ($scope.form.name.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.emailValidClass = function () {
        if (!$scope.form.email.$dirty && !$scope.submitted) {
            return '';
        }
        if ($scope.form.email.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.streetValidClass = function () {
        if (!$scope.form.street.$dirty && !$scope.submitted) {
            return '';
        }
        if ($scope.form.street.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }
    $scope.townValidClass = function () {
        if (!$scope.form.town.$dirty && !$scope.submitted) {
            return '';
        }
        if ($scope.form.town.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }
    $scope.postcodeValidClass = function () {
        if (!$scope.form.postcode.$dirty && !$scope.submitted) {
            return '';
        }
        if ($scope.form.postcode.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.submit = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            var newData = {
                RequestId: $scope.requestId,

                Name: $scope.name,
                Email: $scope.email,
                Organisation: $scope.organisation,
                Address: $scope.street,
                Town: $scope.town,
                PostCode: $scope.postcode,
            }
            requestFactory.update(newData).success(function () {
                $location.path('/orderconfirm/' + $scope.requestId + '/' + $scope.offerId + '/' + $scope.paymode)
            });
        }
    };
}]);