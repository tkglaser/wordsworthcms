var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var RequestController = (function () {
            function RequestController(locationService, logService, sceService, qService, timeoutService, windowService, requestService, gacService, utilService, analyticsService, mailerService) {
                this.locationService = locationService;
                this.logService = logService;
                this.sceService = sceService;
                this.qService = qService;
                this.timeoutService = timeoutService;
                this.windowService = windowService;
                this.requestService = requestService;
                this.gacService = gacService;
                this.utilService = utilService;
                this.analyticsService = analyticsService;
                this.mailerService = mailerService;
                this.locked = true;
                this.requestId = '';
                this.startIsValid = false;
                this.targetIsValid = false;
                this.startPredictions = [];
                this.targetPredictions = [];
                this.StartCountry = '';
                this.TargetCountry = '';
                this.showMap = false;
                this.showNameSection = false;
                this.distance = 0;
                this.duration = 0;
                this.map = null;
                this.StartLatLng = null;
                this.TargetLatLng = null;
                this.ds = new google.maps.DirectionsService();
                this.dr = new google.maps.DirectionsRenderer();
                this.offers = [];
                this.initFinished = false;
                this.mapLoading = false;
                this.offersLoading = false;
                this.requestNumber = 0;
                this.gacValidationMessage = '';
                this.dateSectionSubmitted = false;
                this.startTimeArrive = '';
                this.startTimeDepart = '';
                this.returnTimeArrive = '';
                this.returnTimeDepart = '';
                this.nameSectionSubmitted = false;
                this.isMailFormShown = false;
                this.emailForSending = "";
                this.emailBeingSent = false;
                this.mailSendSuccess = false;
                this.showOfferSection = false;
                this.busShouldStay = false;
                this.isOneWay = false;
                this.dateOptionsStart = $.extend({}, $.datepicker.regional["de"], {
                    minDate: "+1w",
                    numberOfMonths: 3,
                });
                this.dateOptionsReturn = $.extend({}, $.datepicker.regional["de"], {
                    minDate: "+1w",
                    numberOfMonths: 3,
                });
                this.detectInitialState();
            }
            RequestController.prototype.startErrorClass = function () {
                if (this.startIsValid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            ;
            RequestController.prototype.targetErrorClass = function () {
                if (this.targetIsValid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            ;
            RequestController.prototype.onStartNameEdit = function () {
                var _this = this;
                if (!this.initFinished) {
                    return;
                }
                this.gacValidationMessage = '';
                var newValue = this.Request["StartName"].$modelValue;
                this.startIsValid = false;
                this.getRequestId().then(function () {
                    _this.setStatus('');
                    if (newValue != '') {
                        _this.gacService.autocomplete(newValue).then(function (predictions) {
                            _this.startPredictions = predictions;
                        }, function (error) {
                            _this.startPredictions = [];
                        });
                    }
                });
            };
            RequestController.prototype.onTargetNameEdit = function () {
                var _this = this;
                if (!this.initFinished) {
                    return;
                }
                this.gacValidationMessage = '';
                var newValue = this.Request["TargetName"].$modelValue;
                this.targetIsValid = false;
                this.getRequestId().then(function () {
                    _this.setStatus('');
                    if (newValue != '') {
                        _this.targetIsValid = false;
                        _this.gacService.autocomplete(newValue).then(function (predictions) {
                            _this.targetPredictions = predictions;
                        }, function (error) {
                            _this.targetPredictions = [];
                        });
                    }
                });
            };
            RequestController.prototype.isCountry = function (place) {
                for (var typeId = 0; typeId < place.types.length; ++typeId) {
                    if (place.types[typeId] === 'country') {
                        return true;
                    }
                }
                return false;
            };
            RequestController.prototype.setStartPlace = function (place) {
                var _this = this;
                this.gacService.details(place.place_id).then(function (result) {
                    var place = result;
                    if (_this.isCountry(place)) {
                        _this.gacValidationMessage = 'Ein Land kann nicht als Abfahrtsort gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        _this.gacValidationMessage = '';
                        var location = place.geometry.location;
                        _this.StartLat = location.lat;
                        _this.StartLon = location.lng;
                        if (place.formatted_address === 'Deutschland') {
                            _this.Request["StartName"].$setViewValue(place.name + ', ' + place.formatted_address);
                        }
                        else {
                            _this.Request["StartName"].$setViewValue(place.formatted_address);
                        }
                        _this.Request["StartName"].$render();
                        _this.startIsValid = true;
                        _this.startPredictions = [];
                        _this.StartLatLng = new google.maps.LatLng(location.lat, location.lng);
                        _this.StartCountry = _this.utilService.getPlaceCountry(place);
                        _this.renderMapIfReady(true);
                    }
                });
            };
            RequestController.prototype.setTargetPlace = function (place) {
                var _this = this;
                this.gacService.details(place.place_id).then(function (result) {
                    var place = result;
                    if (_this.isCountry(place)) {
                        _this.gacValidationMessage = 'Ein Land kann nicht als Ziel gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        _this.gacValidationMessage = '';
                        var location = place.geometry.location; // TS defs out of sync :(
                        _this.TargetLat = location.lat;
                        _this.TargetLon = location.lng;
                        if (place.formatted_address === 'Deutschland') {
                            _this.Request["TargetName"].$setViewValue(place.name + ', ' + place.formatted_address);
                        }
                        else {
                            _this.Request["TargetName"].$setViewValue(place.formatted_address);
                        }
                        _this.Request["TargetName"].$render();
                        _this.targetIsValid = true;
                        _this.targetPredictions = [];
                        _this.TargetLatLng = place.geometry.location;
                        _this.TargetLatLng = new google.maps.LatLng(location.lat, location.lng);
                        _this.TargetCountry = _this.utilService.getPlaceCountry(place);
                        _this.renderMapIfReady(true);
                    }
                });
            };
            RequestController.prototype.setStatus = function (status) {
                var _this = this;
                if (this.locked) {
                    this.locationService.search('s', 'o');
                    status = 'o';
                }
                this.locationService.search('s', status);
                if (status === 'd') {
                    this.utilService.scrollTo('mapPanel');
                    this.showMap = true;
                    this.showNameSection = false;
                    this.showOfferSection = false;
                    this.analyticsService.pageview('/app/dates');
                }
                else if (status === 'n') {
                    this.showMap = true;
                    this.showNameSection = true;
                    this.showOfferSection = false;
                    this.utilService.scrollTo('namePanel');
                    this.analyticsService.pageview('/app/passengers');
                }
                else if (status === 'o') {
                    this.locked = true;
                    this.offersLoading = true;
                    this.requestService.offers(this.requestId).then(function (data) {
                        _this.offers = data;
                        angular.forEach(_this.offers, function (value) {
                            value.safeProductDescription = _this.sceService.trustAsHtml(value.productDescription);
                        });
                        _this.offersLoading = false;
                    });
                    this.showMap = true;
                    this.showNameSection = true;
                    this.showOfferSection = true;
                    this.utilService.scrollTo('offerPanel');
                    this.analyticsService.pageview('/app/offers');
                }
                else {
                    this.showMap = false;
                    this.showNameSection = false;
                    this.showOfferSection = false;
                    this.analyticsService.pageview('/app/places');
                }
            };
            RequestController.prototype.pad2Digits = function (num) {
                var s = "0" + num;
                return s.substr(s.length - 2);
            };
            RequestController.prototype.getRequestId = function () {
                var _this = this;
                var deferred = this.qService.defer();
                if (this.locked) {
                    this.requestService.create().then(function (id) {
                        _this.locationService.search('r', id);
                        _this.requestId = id;
                        _this.locked = false;
                        _this.showOfferSection = false;
                    }, function (error) {
                        deferred.reject(error);
                    });
                }
                else {
                    deferred.resolve();
                }
                return deferred.promise;
            };
            ;
            RequestController.prototype.save = function (newStatus) {
                var _this = this;
                var deferred = this.qService.defer();
                this.getRequestId().then(function () {
                    var startDate = _this.Request["StartDate"].$modelValue;
                    var newData = {
                        requestId: _this.requestId,
                        startName: _this.Request["StartName"].$modelValue,
                        startCountry: _this.StartCountry,
                        startLat: _this.StartLat,
                        startLon: _this.StartLon,
                        targetName: _this.Request["TargetName"].$modelValue,
                        targetCountry: _this.TargetCountry,
                        targetLat: _this.TargetLat,
                        targetLon: _this.TargetLon,
                        distance: _this.distance,
                        duration: _this.duration,
                        startDate: _this.utilService.isoDateString(_this.Request["StartDate"].$modelValue),
                        startTime: _this.StartTime,
                        startTimeMode: _this.StartTimeMode,
                        returnDate: _this.utilService.isoDateString(_this.Request["ReturnDate"].$modelValue),
                        returnTime: _this.ReturnTime,
                        returnTimeMode: _this.ReturnTimeMode,
                        passengers: _this.Request["Passengers"].$modelValue,
                        name: _this.Request["Name"].$modelValue,
                        email: _this.Request["EMail"].$modelValue,
                        phone: _this.Request["Telephone"].$modelValue,
                        tripType: _this.isOneWay ? 'OneWay' : 'Return',
                        busShouldStay: _this.busShouldStay
                    };
                    return _this.requestService.update(newData);
                }, function (error) {
                    deferred.reject(error);
                }).then(function (request) {
                    if (request.status == 'CannotQuote') {
                        _this.locationService.path('/cannotQuote/' + _this.requestId);
                        _this.locationService.search({});
                    }
                    _this.startTimeArrive = request.startTimeArrive;
                    _this.startTimeDepart = request.startTimeDepart;
                    _this.returnTimeArrive = request.returnTimeArrive;
                    _this.returnTimeDepart = request.returnTimeDepart;
                    _this.requestNumber = request.number;
                    if (newStatus) {
                        _this.setStatus(newStatus.valueOf());
                    }
                    deferred.resolve(request);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            RequestController.prototype.invalidate = function (fieldName) {
                if (!this.initFinished) {
                    return;
                }
                if (fieldName === 'start') {
                    this.startIsValid = false;
                    this.StartLatLng = null;
                    this.locationService.search('s', '');
                    this.showMap = false;
                    this.showNameSection = false;
                    this.showOfferSection = false;
                }
                else if (fieldName === 'target') {
                    this.targetIsValid = false;
                    this.TargetLatLng = null;
                    this.locationService.search('s', '');
                    this.showMap = false;
                    this.showNameSection = false;
                    this.showOfferSection = false;
                }
                else if (fieldName === 'dates') {
                    this.locationService.search('s', 'd');
                    this.showNameSection = false;
                    this.showOfferSection = false;
                    this.showOfferSection = false;
                }
            };
            ;
            RequestController.prototype.displayDistance = function () {
                if (this.duration == 0) {
                    return '';
                }
                var durationHours = Math.floor(this.duration / 60);
                var durationMinutes = this.duration - durationHours * 60;
                var result = ' ' + this.distance + ' km, ';
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
            };
            RequestController.prototype.renderMapIfReady = function (postBack) {
                var _this = this;
                if (this.StartLatLng == null || this.TargetLatLng == null) {
                    this.distance = 0;
                    this.duration = 0;
                    return;
                }
                this.mapLoading = true;
                this.showMap = true;
                this.timeoutService(function () {
                    if (_this.map == null) {
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
                        _this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                        _this.dr.setMap(_this.map);
                    }
                    if (postBack) {
                        _this.utilService.scrollTo('mapPanel');
                    }
                    _this.ds.route({
                        origin: _this.StartLatLng,
                        destination: _this.TargetLatLng,
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC
                    }, function (result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            _this.dr.setDirections(result);
                            if (postBack) {
                                _this.save().then(function (data) {
                                    _this.distance = data.distance;
                                    _this.duration = data.duration;
                                    _this.setStatus('d');
                                    _this.mapLoading = false;
                                });
                            }
                            else {
                                _this.mapLoading = false;
                            }
                            ;
                        }
                        else {
                            _this.distance = 0;
                            _this.duration = 0;
                            _this.mapLoading = false;
                        }
                    });
                });
            };
            RequestController.prototype.startDateChanged = function (val) {
                this.dateOptionsReturn.minDate = val;
                this.Request["ReturnDate"].$setViewValue(val);
                this.Request["ReturnDate"].$render();
                this.invalidate('dates');
            };
            RequestController.prototype.returnDateChanged = function (val) {
                this.dateOptionsStart.maxDate = val;
                this.invalidate('dates');
            };
            RequestController.prototype.isDateSectionValid = function () {
                return this.Request["StartDate"].$valid && this.Request["ReturnDate"].$valid;
            };
            ;
            RequestController.prototype.startDateErrorClass = function () {
                if (!this.Request["StartDate"].$dirty && !this.dateSectionSubmitted) {
                    return '';
                }
                if (this.Request["StartDate"].$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            RequestController.prototype.returnDateErrorClass = function () {
                if (!this.Request["ReturnDate"].$dirty && !this.dateSectionSubmitted) {
                    return '';
                }
                if (this.Request["ReturnDate"].$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            RequestController.prototype.submitDateSection = function () {
                this.dateSectionSubmitted = true;
                this.analyticsService.buttonclick('dates');
                if (this.isDateSectionValid()) {
                    this.save('n');
                }
            };
            RequestController.prototype.passengersEdited = function () {
                var _this = this;
                if (!this.initFinished) {
                    return;
                }
                if (this.locked) {
                    this.nameSectionSubmitted = false;
                    this.getRequestId().then(function () {
                        _this.save('n');
                    });
                }
            };
            RequestController.prototype.passengerErrorClass = function () {
                if (!this.Request["Passengers"].$dirty && !this.nameSectionSubmitted) {
                    return '';
                }
                if (this.Request["Passengers"].$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            RequestController.prototype.nameErrorClass = function () {
                if (!this.Request["Name"].$dirty && !this.nameSectionSubmitted) {
                    return '';
                }
                if (this.Request["Name"].$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            RequestController.prototype.emailErrorClass = function () {
                if (!this.Request["EMail"].$dirty && !this.nameSectionSubmitted) {
                    return '';
                }
                if (this.Request["EMail"].$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            RequestController.prototype.telephoneErrorClass = function () {
                if (!this.Request["Telephone"].$dirty && !this.nameSectionSubmitted) {
                    return '';
                }
                if (this.Request["Telephone"].$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            RequestController.prototype.nameSectionValid = function () {
                return this.Request.$valid;
            };
            RequestController.prototype.submitNameSection = function () {
                var _this = this;
                this.nameSectionSubmitted = true;
                this.analyticsService.buttonclick('passengers');
                if (this.nameSectionValid()) {
                    this.offersLoading = true;
                    this.save().then(function () {
                        _this.analyticsService.offersdisplayed();
                        _this.setStatus('o');
                    });
                }
            };
            RequestController.prototype.detectInitialState = function () {
                var _this = this;
                var state = this.locationService.search();
                if (state.hasOwnProperty('r')) {
                    this.requestId = state.r;
                    this.requestService.get(state.r).then(function (data) {
                        _this.requestNumber = data.number;
                        if (data.hasOwnProperty('startLat')) {
                            _this.Request["StartName"].$setViewValue(data.startName);
                            _this.Request["StartName"].$render();
                            _this.StartCountry = data.startCountry;
                            _this.StartLat = data.startLat;
                            _this.StartLon = data.startLon;
                            _this.StartLatLng = new google.maps.LatLng(data.startLat, data.startLon);
                            _this.startIsValid = true;
                            _this.Request["TargetName"].$setViewValue(data.targetName);
                            _this.Request["TargetName"].$render();
                            _this.TargetCountry = data.targetCountry;
                            _this.TargetLat = data.targetLat;
                            _this.TargetLon = data.targetLon;
                            _this.TargetLatLng = new google.maps.LatLng(data.targetLat, data.targetLon);
                            _this.targetIsValid = true;
                            _this.distance = data.distance;
                            _this.duration = data.duration;
                            _this.renderMapIfReady(false);
                        }
                        if (data.startDate != null) {
                            var sDate = new Date(data.startDate);
                            var rDate = new Date(data.returnDate);
                            _this.Request["StartDate"].$setViewValue(sDate);
                            _this.Request["StartDate"].$render();
                            _this.StartTime = _this.pad2Digits(sDate.getUTCHours()) + ':' + _this.pad2Digits(sDate.getUTCMinutes());
                            _this.Request["ReturnDate"].$setViewValue(rDate);
                            _this.Request["ReturnDate"].$render();
                            _this.ReturnTime = _this.pad2Digits(rDate.getUTCHours()) + ':' + _this.pad2Digits(rDate.getUTCMinutes());
                            _this.startTimeArrive = data.startTimeArrive;
                            _this.startTimeDepart = data.startTimeDepart;
                            _this.returnTimeArrive = data.returnTimeArrive;
                            _this.returnTimeDepart = data.returnTimeDepart;
                            _this.StartTimeMode = data.startTimeMode;
                            _this.ReturnTimeMode = data.returnTimeMode;
                        }
                        _this.busShouldStay = data.busShouldStay;
                        if (data.tripType == 'OneWay') {
                            _this.isOneWay = true;
                        }
                        else {
                            _this.isOneWay = false;
                        }
                        if (data.passengers > 0) {
                            _this.Request["Passengers"].$setViewValue(data.passengers);
                            _this.Request["Passengers"].$render();
                        }
                        _this.Request["Name"].$setViewValue(data.name);
                        _this.Request["Name"].$render();
                        _this.Request["EMail"].$setViewValue(data.email);
                        _this.Request["EMail"].$render();
                        _this.Request["Telephone"].$setViewValue(data.phone);
                        _this.Request["Telephone"].$render();
                        _this.locked = data.isLocked;
                        if (_this.locked) {
                            if (state.s === 'recalc') {
                                _this.locationService.search('s', 'n');
                                state.s = 'n';
                                data.isOfferExpired = false;
                            }
                            else {
                                _this.locationService.search('s', 'o');
                                state.s = 'o';
                            }
                        }
                        if (state.s === 'd') {
                            _this.utilService.scrollTo('mapPanel');
                            _this.analyticsService.pageview('/app/dates');
                        }
                        else if (state.s === 'n') {
                            _this.showNameSection = true;
                            _this.utilService.jumpTo('namePanel');
                            _this.analyticsService.pageview('/app/passengers');
                        }
                        else if (state.s === 'o') {
                            _this.locked = true;
                            _this.offersLoading = true;
                            _this.requestService.offers(_this.requestId).then(function (data) {
                                _this.offers = data;
                                angular.forEach(_this.offers, function (value) {
                                    value.safeProductDescription = _this.sceService.trustAsHtml(value.productDescription);
                                });
                                _this.offersLoading = false;
                            });
                            _this.showNameSection = true;
                            _this.showOfferSection = true;
                            _this.utilService.jumpTo('offerPanel');
                            _this.analyticsService.pageview('/app/offers');
                        }
                        else {
                            _this.analyticsService.pageview('/app/places');
                        }
                        if (data.isOfferExpired) {
                            _this.locationService.path('/offerExpired/' + _this.requestId);
                        }
                        _this.initFinished = true;
                    }, function (error) {
                        _this.logService.error(error);
                    });
                }
                else {
                    this.initFinished = true;
                    this.analyticsService.pageview('/app/places');
                }
            };
            RequestController.prototype.print = function () {
                this.windowService.print();
            };
            ;
            RequestController.prototype.showMailForm = function () {
                this.emailForSending = this.Request["EMail"].$modelValue;
                this.isMailFormShown = true;
            };
            RequestController.prototype.sendMail = function () {
                var _this = this;
                this.emailBeingSent = true;
                this.mailerService.sendMail({
                    Id: this.requestId,
                    Type: 'offer',
                    Email: this.emailForSending
                }).then(function () {
                    _this.emailBeingSent = false;
                    _this.mailSendSuccess = true;
                    _this.timeoutService(function () {
                        _this.mailSendSuccess = false;
                        _this.isMailFormShown = false;
                    }, 2000);
                });
            };
            RequestController.$inject = [
                '$location', '$log', '$sce', '$q', '$timeout', '$window',
                'RequestService', 'gacService', 'UtilService', 'AnalyticsService', 'MailerService'];
            return RequestController;
        })();
        angular.module('pfb').controller('RequestController', RequestController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
