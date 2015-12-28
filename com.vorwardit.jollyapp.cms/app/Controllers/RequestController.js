'use strict';
app.controller('RequestController', [
    '$scope', '$timeout', '$location', '$q', 'utilFactory',
    '$log', '$sce', '$window', 'gacFactory', 'requestFactory', 'mailerFactory', 'analyticsFactory',
function ($scope, $timeout, $location, $q, util, $log, $sce, $window, gacFactory, requestFactory, mailerFactory, analytics) {
    $scope.locked = true;
    $scope.requestId = '';
    $scope.startIsValid = false;
    $scope.targetIsValid = false;
    $scope.startPredictions = [];
    $scope.targetPredictions = [];
    $scope.StartCountry = '';
    $scope.TargetCountry = '';
    $scope.showMap = false;
    $scope.showNameSection = false;
    $scope.distance = 0;
    $scope.duration = 0;
    $scope.map = null;
    $scope.StartLatLng = null;
    $scope.TargetLatLng = null;
    $scope.ds = new google.maps.DirectionsService();
    $scope.dr = new google.maps.DirectionsRenderer();
    $scope.Request = {};
    $scope.offers = [];
    $scope.initFinished = false;
    $scope.mapLoading = false;
    $scope.offersLoading = false;
    $scope.requestNumber = 0;
    $scope.gacValidationMessage = '';

    $scope.startErrorClass = function () {
        if ($scope.startIsValid) {
            return 'has-success';
        } else {
            return 'has-error'
        }
    };

    $scope.targetErrorClass = function () {
        if ($scope.targetIsValid) {
            return 'has-success';
        } else {
            return 'has-error'
        }
    };

    $scope.onStartNameEdit = function () {
        if (!$scope.initFinished) {
            return;
        }

        $scope.gacValidationMessage = '';
        var newValue = $scope.StartName;

        $scope.startIsValid = false;
        $scope.getRequestId().then(function () {
            $scope.setStatus('');
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
        })
    }

    $scope.onTargetNameEdit = function () {
        if (!$scope.initFinished) {
            return;
        }

        $scope.gacValidationMessage = '';
        var newValue = $scope.TargetName;

        $scope.targetIsValid = false;
        $scope.getRequestId().then(function () {
            $scope.setStatus('');
            if (newValue != '') {
                $scope.targetIsValid = false;
                gacFactory.autocomplete(newValue)
                .success(function (data, status, headers, config) {
                    if (data.status == "OK") {
                        $scope.targetPredictions = data.predictions;
                    } else {
                        $scope.targetPredictions = [];
                    }
                });
            }
        });
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
                    $scope.StartLatLng = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
                    $scope.StartCountry = util.getPlaceCountry(place);
                    $scope.renderMapIfReady(true);
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
                    $scope.TargetLatLng = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
                    $scope.TargetCountry = util.getPlaceCountry(place);
                    $scope.renderMapIfReady(true);
                }
            }
        })
    }

    $scope.setStatus = function (status) {
        if ($scope.locked) {
            $location.search('s', 'o');
            status = 'o';
        }

        $location.search('s', status);

        if (status === 'd') {
            util.scrollTo('mapPanel');
            $scope.showMap = true;
            $scope.showNameSection = false;
            $scope.showOfferSection = false;
            analytics.pageView('/app/dates');
        }
        else if (status === 'n') {
            $scope.showMap = true;
            $scope.showNameSection = true;
            $scope.showOfferSection = false;
            util.scrollTo('namePanel');
            analytics.pageView('/app/passengers');
        }
        else if (status === 'o') {
            $scope.locked = true;
            $scope.offersLoading = true;
            requestFactory.offers($scope.requestId).then(function (data) {
                $scope.offers = data;
                angular.forEach($scope.offers, function (value) {
                    value.safeProductDescription = $sce.trustAsHtml(value.productDescription);
                });
                $scope.offersLoading = false;
            });
            $scope.showMap = true;
            $scope.showNameSection = true;
            $scope.showOfferSection = true;
            util.scrollTo('offerPanel');
            analytics.pageView('/app/offers');
        }
        else {
            $scope.showMap = false;
            $scope.showNameSection = false;
            $scope.showOfferSection = false;
            analytics.pageView('/app/places');
        }
    }

    function pad2Digits(num) {
        var s = "0" + num;
        return s.substr(s.length - 2);
    }

    $scope.getRequestId = function () {
        if ($scope.locked) {
            return requestFactory.create().success(function (data) {
                $location.search('r', data);
                $scope.requestId = data;
                $scope.locked = false;
                $scope.showOfferSection = false;
            });
        } else {
            return $q.when();
        }
    };

    $scope.save = function (newStatus) {
        return $scope.getRequestId().then(function (data) {
            var startDate = $scope.Request.StartDate.$modelValue;
            var newData = {
                RequestId: $scope.requestId,

                StartName: $scope.StartName,
                StartCountry: $scope.StartCountry,
                StartLat: $scope.StartLat,
                StartLon: $scope.StartLon,
                TargetName: $scope.TargetName,
                TargetCountry: $scope.TargetCountry,
                TargetLat: $scope.TargetLat,
                TargetLon: $scope.TargetLon,
                Distance: $scope.distance,
                Duration: $scope.duration,
                StartDate: util.isoDateString($scope.Request.StartDate.$modelValue),
                StartTime: $scope.StartTime,
                StartTimeMode: $scope.StartTimeMode,
                ReturnDate: util.isoDateString($scope.Request.ReturnDate.$modelValue),
                ReturnTime: $scope.ReturnTime,
                ReturnTimeMode: $scope.ReturnTimeMode,
                Passengers: $scope.Passengers,
                Name: $scope.Name,
                Email: $scope.EMail,
                Phone: $scope.Telephone,
                TripType: $scope.isOneWay ? 'OneWay' : 'Return',
                BusShouldStay: $scope.busShouldStay
            }
            return requestFactory.update(newData).then(function (data) {
                if (data.data.status == 'CannotQuote') {
                    $location.path('/cannotQuote/' + $scope.requestId);
                    $location.search({});
                }
                $scope.startTimeArrive = data.data.startTimeArrive;
                $scope.startTimeDepart = data.data.startTimeDepart;
                $scope.returnTimeArrive = data.data.returnTimeArrive;
                $scope.returnTimeDepart = data.data.returnTimeDepart;
                $scope.requestNumber = data.data.number;
                if (typeof newStatus !== 'undefined') {
                    $scope.setStatus(newStatus);
                }
                return data;
            });
        });
    }


    //$('.clockpicker').clockpicker();

    $scope.invalidate = function (fieldName) {
        if (!$scope.initFinished) {
            return;
        }
        if (fieldName === 'start') {
            $scope.startIsValid = false;
            $scope.StartLatLng = null;
            $location.search('s', '');
            $scope.showMap = false;
            $scope.showNameSection = false;
            $scope.showOfferSection = false;
        } else if (fieldName === 'target') {
            $scope.targetIsValid = false;
            $scope.TargetLatLng = null;
            $location.search('s', '');
            $scope.showMap = false;
            $scope.showNameSection = false;
            $scope.showOfferSection = false;
        }
        else if (fieldName === 'dates') {
            $location.search('s', 'd');
            $scope.showNameSection = false;
            $scope.showOfferSection = false;
            $scope.showOfferSection = false;
        }
    };

    $scope.displayDistance = function () {
        if ($scope.duration == 0) {
            return '';
        }
        var durationHours = Math.floor($scope.duration / 60);
        var durationMinutes = $scope.duration - durationHours * 60;
        var result = ' ' + $scope.distance + ' km, ';
        if (durationHours == 0) {
        }
        else if (durationHours == 1) {
            result = result + ' 1 Stunde ';
        }
        else {
            result = result + durationHours + ' Stunden ';
        }
        if (durationMinutes == 1) {
            result = result + ' 1 Minute';
        }
        else {
            result = result + durationMinutes + ' Minuten';
        }
        return result;
    }

    $scope.renderMapIfReady = function (postBack) {
        if ($scope.StartLatLng == null || $scope.TargetLatLng == null) {
            $scope.distance = 0;
            $scope.duration = 0;
            return;
        }
        $scope.mapLoading = true;
        $scope.showMap = true;
        //if (postBack) {
        //    $scope.$apply();
        //}
        $timeout(function () {
            if ($scope.map == null) {
                var mapOptions = {
                    scrollwheel: false,
                    navigationControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    draggable: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: new google.maps.LatLng(50, 10),
                    zoom: 5
                };

                $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                $scope.dr.setMap($scope.map);
            }

            if (postBack) {
                util.scrollTo('mapPanel');
            }

            $scope.ds.route({
                origin: $scope.StartLatLng,
                destination: $scope.TargetLatLng,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            }, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    $scope.dr.setDirections(result);
                    if (postBack) {
                        $scope.save().then(function (data) {
                            $scope.distance = data.data.distance;
                            $scope.duration = data.data.duration;

                            $scope.setStatus('d');
                            $scope.mapLoading = false;
                        });
                    } else {
                        $scope.mapLoading = false;
                    };
                }
                else {
                    $scope.distance = 0;
                    $scope.duration = 0;
                    $scope.mapLoading = false;
                }
            })
        });
    }

    // =============== Date Section =======================

    $scope.dateSectionSubmitted = false;
    $scope.startTimeArrive = '';
    $scope.startTimeDepart = '';
    $scope.returnTimeArrive = '';
    $scope.returnTimeDepart = '';

    $scope.dateOptionsStart = $.extend({}, $.datepicker.regional["de"], {
        minDate: "+1w",
        numberOfMonths: 3,
    });

    $scope.dateOptionsReturn = $.extend({}, $.datepicker.regional["de"], {
        minDate: "+1w",
        numberOfMonths: 3,
    });

    $scope.$watch('StartDate', function (val) {
        $scope.dateOptionsReturn.minDate = val;
        if ($scope.ReturnDate == null && val != null) {
            $scope.Request.ReturnDate.$setViewValue(val);
            $scope.ReturnDate = val;
        }
    });

    $scope.$watch('ReturnDate', function (val) {
        $scope.dateOptionsStart.maxDate = val;
    });

    $scope.isDateSectionValid = function () {
        return $scope.Request.StartDate.$valid && $scope.Request.ReturnDate.$valid;
    };

    $scope.startDateErrorClass = function () {
        if (!$scope.Request.StartDate.$dirty && !$scope.dateSectionSubmitted) {
            return '';
        }
        if ($scope.Request.StartDate.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.returnDateErrorClass = function () {
        if (!$scope.Request.ReturnDate.$dirty && !$scope.dateSectionSubmitted) {
            return '';
        }
        if ($scope.Request.ReturnDate.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.submitDateSection = function () {
        $scope.dateSectionSubmitted = true;
        analytics.buttonClick('dates');
        if ($scope.isDateSectionValid()) {
            $scope.save('n');
        }
    }

    // =============== Name Section =======================

    $scope.nameSectionSubmitted = false;

    $scope.passengersEdited = function () {
        if (!$scope.initFinished) {
            return;
        }

        if ($scope.locked) {
            $scope.nameSectionSubmitted = false;
            $scope.getRequestId().then(function () {
                $scope.save();
                $scope.setStatus('n');
            });
        }
    }

    //$scope.$watch('Passengers', function () {
    //})

    $scope.passengerErrorClass = function () {
        if (!$scope.Request.Passengers.$dirty && !$scope.nameSectionSubmitted) {
            return '';
        }
        if ($scope.Request.Passengers.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.nameErrorClass = function () {
        if (!$scope.Request.Name.$dirty && !$scope.nameSectionSubmitted) {
            return '';
        }
        if ($scope.Request.Name.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.emailErrorClass = function () {
        if (!$scope.Request.EMail.$dirty && !$scope.nameSectionSubmitted) {
            return '';
        }
        if ($scope.Request.EMail.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.telephoneErrorClass = function () {
        if (!$scope.Request.Telephone.$dirty && !$scope.nameSectionSubmitted) {
            return '';
        }
        if ($scope.Request.Telephone.$valid) {
            return 'has-success';
        } else {
            return 'has-error';
        }
    }

    $scope.nameSectionValid = function () {
        return $scope.Request.$valid;
    }

    $scope.submitNameSection = function () {
        $scope.nameSectionSubmitted = true;
        analytics.buttonClick('passengers');
        if ($scope.nameSectionValid()) {
            $scope.offersLoading = true;
            $scope.save().then(function () {
                analytics.offersDisplayed();
                $scope.setStatus('o');
            });
        }
    }

    // =============== Offer Section =======================
    $scope.detectInitialState = function () {
        var state = $location.search();
        if (state.hasOwnProperty('r')) {
            $scope.requestId = state.r;
            requestFactory.get(state.r).success(function (data) {
                $scope.requestNumber = data.number;
                if (data.hasOwnProperty('startLat')) {
                    $scope.Request.StartName.$setViewValue($scope.Request.StartName.$setViewValue);
                    $scope.StartName = data.startName;
                    $scope.StartCountry = data.startCountry;
                    $scope.StartLat = data.startLat;
                    $scope.StartLon = data.startLon;
                    $scope.StartLatLng = new google.maps.LatLng(data.startLat, data.startLon);
                    $scope.startIsValid = true;
                    $scope.Request.TargetName.$setViewValue($scope.Request.TargetName.$setViewValue);

                    $scope.TargetName = data.targetName;
                    $scope.TargetCountry = data.targetCountry;
                    $scope.TargetLat = data.targetLat;
                    $scope.TargetLon = data.targetLon;
                    $scope.TargetLatLng = new google.maps.LatLng(data.targetLat, data.targetLon);
                    $scope.targetIsValid = true;
                    $scope.distance = data.distance;
                    $scope.duration = data.duration;
                    $scope.renderMapIfReady(false);
                }

                if (data.startDate != null) {
                    var sDate = new Date(data.startDate);
                    var rDate = new Date(data.returnDate);
                    $scope.Request.StartDate.$setViewValue(sDate);
                    $scope.StartDate = sDate;
                    $scope.StartTime = pad2Digits(sDate.getUTCHours()) + ':' + pad2Digits(sDate.getUTCMinutes());
                    $scope.Request.ReturnDate.$setViewValue(rDate);
                    $scope.ReturnDate = rDate;
                    $scope.ReturnTime = pad2Digits(rDate.getUTCHours()) + ':' + pad2Digits(rDate.getUTCMinutes());
                    $scope.startTimeArrive = data.startTimeArrive;
                    $scope.startTimeDepart = data.startTimeDepart;
                    $scope.returnTimeArrive = data.returnTimeArrive;
                    $scope.returnTimeDepart = data.returnTimeDepart;

                    $scope.StartTimeMode = data.startTimeMode;
                    $scope.ReturnTimeMode = data.returnTimeMode;
                }
                $scope.busShouldStay = data.busShouldStay;
                if (data.tripType == 'OneWay') {
                    $scope.isOneWay = true;
                }
                else {
                    $scope.isOneWay = false;
                }
                if (data.passengers > 0) {
                    $scope.Passengers = data.passengers;
                }
                $scope.Name = data.name;
                $scope.EMail = data.email;
                $scope.Telephone = data.phone;
                $scope.locked = data.isLocked;

                if ($scope.locked) {
                    if (state.s === 'recalc') {
                        $location.search('s', 'n');
                        state.s = 'n';
                        data.isOfferExpired = false;
                    }
                    else {
                        $location.search('s', 'o');
                        state.s = 'o';
                    }
                }

                if (state.s === 'd') {
                    util.scrollTo('mapPanel');
                    analytics.pageView('/app/dates');
                }
                else if (state.s === 'n') {
                    $scope.showNameSection = true;
                    util.jumpTo('namePanel');
                    analytics.pageView('/app/passengers');
                }
                else if (state.s === 'o') {
                    $scope.locked = true;
                    $scope.offersLoading = true;
                    requestFactory.offers($scope.requestId).then(function (data) {
                        $scope.offers = data;
                        angular.forEach($scope.offers, function (value) {
                            value.safeProductDescription = $sce.trustAsHtml(value.productDescription);
                        });
                        $scope.offersLoading = false;
                    });
                    $scope.showNameSection = true;
                    $scope.showOfferSection = true;
                    util.jumpTo('offerPanel');
                    analytics.pageView('/app/offers');
                }
                else {
                    analytics.pageView('/app/places');
                }
                if (data.isOfferExpired) {
                    $location.path('/offerExpired/' + $scope.requestId);
                }
                $scope.initFinished = true;
            })
            .error(function (data) {
                $log.error(data)
            })
            ;
        }
        else {
            $scope.initFinished = true;
            analytics.pageView('/app/places');
        }
    }

    $scope.detectInitialState();

    // =============== Mailing Section =======================
    $scope.isMailFormShown = false;
    $scope.emailForSending = "";
    $scope.emailBeingSent = false;
    $scope.mailSendSuccess = false;

    $scope.print = function () {
        $window.print();
    };

    $scope.showMailForm = function () {
        $scope.emailForSending = $scope.EMail;
        $scope.isMailFormShown = true;
    }

    $scope.sendMail = function () {
        $scope.emailBeingSent = true;

        mailerFactory.sendMail({
            Id: $scope.requestId,
            Type: 'offer',
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

}])