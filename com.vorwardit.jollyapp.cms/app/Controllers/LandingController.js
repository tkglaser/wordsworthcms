'use strict';

app.controller('LandingController', [
    '$routeParams', '$scope', '$location', '$timeout', '$q', '$log', '$window',
    'gacFactory', 'requestFactory', 'utilFactory', 'analyticsFactory',
function ($routeParams, $scope, $location, $timeout, $q, $log, $window, gacFactory, requestFactory, util, analytics) {
    $scope.requestId = '';
    $scope.startIsValid = false;
    $scope.targetIsValid = false;
    $scope.StartLatLng = null;
    $scope.TargetLatLng = null;
    $scope.StartCountry = '';
    $scope.TargetCountry = '';
    $scope.mapSubmitted = false;
    $scope.mapLoading = false;
    $scope.startAutocomplete = null;
    $scope.targetAutocomplete = null;
    $scope.startPredictions = [];
    $scope.targetPredictions = [];
    $scope.gacValidationMessage = '';
    $scope.ValueTrack = {};

    var valuetrack = $location.search();
    if (valuetrack.hasOwnProperty('k')) {
        $scope.ValueTrack.KeyWord = valuetrack.k;
    }
    if (valuetrack.hasOwnProperty('d')) {
        $scope.ValueTrack.Device = valuetrack.d;
    }
    if (valuetrack.hasOwnProperty('m')) {
        $scope.ValueTrack.MatchType = valuetrack.m;
    }

    $location.search('k', null);
    $location.search('d', null);
    $location.search('m', null);

    if ($routeParams.startSearch != '') {
        gacFactory.autocomplete($routeParams.startSearch)
            .success(function (data, status, headers, config) {
                if (data.status == "OK") {
                    $scope.setStartPlace(data.predictions[0]);
                }
            });
    }

    if ($routeParams.targetSearch != '') {
        gacFactory.autocomplete($routeParams.targetSearch)
            .success(function (data, status, headers, config) {
                if (data.status == "OK") {
                    $scope.setTargetPlace(data.predictions[0]);
                }
            });
    }

    $scope.$on('$viewContentLoaded', function (event) {
        analytics.pageView();
    });

    $("body,html").scrollTop(0);

    $scope.startErrorClass = function () {
        if (!$scope.Request.StartName.$dirty && !$scope.mapSubmitted) {
            return '';
        }
        if ($scope.startIsValid) {
            return 'has-success';
        } else {
            return 'has-error'
        }
    };

    $scope.targetErrorClass = function () {
        if (!$scope.Request.TargetName.$dirty && !$scope.mapSubmitted) {
            return '';
        }
        if ($scope.targetIsValid) {
            return 'has-success';
        } else {
            return 'has-error'
        }
    };

    $scope.submitMap = function () {
        $scope.mapSubmitted = true;
    };

    $scope.redirectIfReady = function (postBack) {
        if ($scope.StartLatLng == null || $scope.TargetLatLng == null) {
            $scope.distance = 0;
            $scope.duration = 0;
            return;
        }

        analytics.buttonClick('landing');

        $scope.mapLoading = true;

        requestFactory.create()
            .success(function (data) {
                $scope.requestId = data;
            })
            .then(function () {
                var newData = $.extend({}, $scope.ValueTrack, {
                    RequestId: $scope.requestId,
                    StartName: $scope.StartName,
                    StartCountry: $scope.StartCountry,
                    StartLat: $scope.StartLat,
                    StartLon: $scope.StartLon,
                    TargetName: $scope.TargetName,
                    TargetCountry: $scope.TargetCountry,
                    TargetLat: $scope.TargetLat,
                    TargetLon: $scope.TargetLon
                });
                return requestFactory.update(newData);
            })
            .then(function (data) {
                if (data.data.status == 'CannotQuote') {
                    $location.path('/cannotQuote/' + $scope.requestId);
                } else {
                    $location.path('/request');
                    $location.search('r', $scope.requestId);
                    $location.search('s', 'd');
                }
            });
    }

    $scope.onStartNameEdit = function () {
        $scope.startIsValid = false;
        $scope.gacValidationMessage = '';
        var newValue = $scope.StartName;
        if (newValue != '') {
            gacFactory.autocomplete(newValue)
            .success(function (data, status, headers, config) {
                if (data.status == "OK") {
                    $scope.startPredictions = data.predictions;
                } else {
                    $scope.startPredictions = [];
                }
            });
        }
    }

    $scope.onTargetNameEdit = function () {
        $scope.targetIsValid = false;
        $scope.gacValidationMessage = '';
        var newValue = $scope.TargetName;
        if (newValue != '') {
            gacFactory.autocomplete(newValue)
            .success(function (data, status, headers, config) {
                if (data.status == "OK") {
                    $scope.targetPredictions = data.predictions;
                } else {
                    $scope.targetPredictions = [];
                }
            });
        }
    }

    $scope.isCountry = function (place) {
        for (var typeId = 0; typeId < place.types.length; ++typeId) {
            if (place.types[typeId] === 'country') {
                return true;
            }
        }
        return false;
    }

    $scope.setStartPlace = function (place) {
        gacFactory.details(place.place_id)
        .success(function (data) {
            if (data.status == "OK") {
                var place = data.result;
                if ($scope.isCountry(place)) {
                    $scope.gacValidationMessage = 'Ein Land kann nicht als Abfahrtsort gewählt werden!';
                    return;
                }
                if (place.geometry) {
                    $scope.gacValidationMessage = '';
                    $scope.StartLat = place.geometry.location.lat;
                    $scope.StartLon = place.geometry.location.lng;
                    if (place.formatted_address === 'Deutschland') {
                        $scope.StartName = place.name + ', ' + place.formatted_address;
                    } else {
                        $scope.StartName = place.formatted_address;
                    }
                    $scope.startIsValid = true;
                    $scope.startPredictions = [];
                    $scope.StartLatLng = place.geometry.location;
                    $scope.StartCountry = util.getPlaceCountry(place);
                    $scope.redirectIfReady();
                }
            }
        })
    }

    $scope.setTargetPlace = function (place) {
        gacFactory.details(place.place_id)
        .success(function (data) {
            if (data.status == "OK") {
                var place = data.result;
                if ($scope.isCountry(place)) {
                    $scope.gacValidationMessage = 'Ein Land kann nicht als Ziel gewählt werden!';
                    return;
                }
                if (place.geometry) {
                    $scope.gacValidationMessage = '';
                    $scope.TargetLat = place.geometry.location.lat;
                    $scope.TargetLon = place.geometry.location.lng;
                    if (place.formatted_address === 'Deutschland') {
                        $scope.TargetName = place.name + ', ' + place.formatted_address;
                    } else {
                        $scope.TargetName = place.formatted_address;
                    }
                    $scope.targetIsValid = true;
                    $scope.targetPredictions = [];
                    $scope.TargetLatLng = place.geometry.location;
                    $scope.TargetCountry = util.getPlaceCountry(place);
                    $scope.redirectIfReady();
                }
            }
        })
    }

    $scope.cumulativeOffset = function (element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: top,
            left: left
        };
    };

    $scope.onDownArrowClick = function () {
        $timeout(function () {
            var nav = document.getElementById('mainNavbar');
            var navHeight = nav.clientHeight;
            var elm = document.getElementById('downArrow');
            var st = $scope.cumulativeOffset(elm).top;// - navHeight - 10;
            $log.info('nav is ' + navHeight + ' high, jumping to ' + st);
            $("body,html").animate({ scrollTop: st }, "slow");
        });
    }
}])