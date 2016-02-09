var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var LandingController = (function () {
            function LandingController(locationService, routeParamsService, timeoutService, requestService, gacService, analyticsService, utilService) {
                var _this = this;
                this.locationService = locationService;
                this.routeParamsService = routeParamsService;
                this.timeoutService = timeoutService;
                this.requestService = requestService;
                this.gacService = gacService;
                this.analyticsService = analyticsService;
                this.utilService = utilService;
                this.requestId = '';
                this.startIsValid = false;
                this.targetIsValid = false;
                this.StartLatLng = null;
                this.TargetLatLng = null;
                this.StartCountry = '';
                this.TargetCountry = '';
                this.mapSubmitted = false;
                this.mapLoading = false;
                this.startAutocomplete = null;
                this.targetAutocomplete = null;
                this.startPredictions = [];
                this.targetPredictions = [];
                this.gacValidationMessage = '';
                this.ValueTrack = {};
                this.distance = 0;
                this.duration = 0;
                var valuetrack = this.locationService.search();
                if (valuetrack.hasOwnProperty('k')) {
                    this.ValueTrack.KeyWord = valuetrack.k;
                }
                if (valuetrack.hasOwnProperty('d')) {
                    this.ValueTrack.Device = valuetrack.d;
                }
                if (valuetrack.hasOwnProperty('m')) {
                    this.ValueTrack.MatchType = valuetrack.m;
                }
                this.locationService.search('k', null);
                this.locationService.search('d', null);
                this.locationService.search('m', null);
                if (this.routeParamsService["startSearch"] != '') {
                    var ss = this.routeParamsService["startSearch"];
                    this.gacService.autocomplete(this.routeParamsService["startSearch"]).then(function (predictions) {
                        _this.setStartPlace(predictions[0]);
                    });
                }
                if (this.routeParamsService["targetSearch"] != '') {
                    this.gacService.autocomplete(this.routeParamsService["targetSearch"]).then(function (predictions) {
                        _this.setTargetPlace(predictions[0]);
                    });
                }
                // TODO
                //this.$on('$viewContentLoaded', function (event) {
                //    this.analyticsService.pageView();
                //});
                $("body,html").scrollTop(0);
            }
            LandingController.prototype.startErrorClass = function () {
                if (!this.Request["StartName"].$dirty && !this.mapSubmitted) {
                    return '';
                }
                if (this.startIsValid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            ;
            LandingController.prototype.targetErrorClass = function () {
                if (!this.Request["TargetName"].$dirty && !this.mapSubmitted) {
                    return '';
                }
                if (this.targetIsValid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            ;
            LandingController.prototype.submitMap = function () {
                this.mapSubmitted = true;
            };
            ;
            LandingController.prototype.redirectIfReady = function () {
                var _this = this;
                if (this.StartLatLng == null || this.TargetLatLng == null) {
                    this.distance = 0;
                    this.duration = 0;
                    return;
                }
                this.analyticsService.buttonclick('landing');
                this.mapLoading = true;
                this.requestService.create()
                    .then(function (data) {
                    _this.requestId = data;
                    var newData = $.extend({}, _this.ValueTrack, {
                        RequestId: _this.requestId,
                        StartName: _this.Request["StartName"].$modelValue,
                        StartCountry: _this.StartCountry,
                        StartLat: _this.StartLat,
                        StartLon: _this.StartLon,
                        TargetName: _this.Request["TargetName"].$modelValue,
                        TargetCountry: _this.TargetCountry,
                        TargetLat: _this.TargetLat,
                        TargetLon: _this.TargetLon
                    });
                    return _this.requestService.update(newData);
                }).then(function (data) {
                    if (data.data.status == 'CannotQuote') {
                        _this.locationService.path('/cannotQuote/' + _this.requestId);
                    }
                    else {
                        _this.locationService.path('/request');
                        _this.locationService.search('r', _this.requestId);
                        _this.locationService.search('s', 'd');
                    }
                });
            };
            LandingController.prototype.onStartNameEdit = function () {
                var _this = this;
                this.startIsValid = false;
                this.gacValidationMessage = '';
                var newValue = this.Request["StartName"].$modelValue;
                if (newValue != '') {
                    this.gacService.autocomplete(newValue).then(function (predictions) {
                        _this.startPredictions = predictions;
                    }, function (error) {
                        _this.startPredictions = [];
                    });
                }
            };
            LandingController.prototype.onTargetNameEdit = function () {
                var _this = this;
                this.targetIsValid = false;
                this.gacValidationMessage = '';
                var newValue = this.Request["TargetName"].$modelValue;
                if (newValue != '') {
                    this.gacService.autocomplete(newValue).then(function (predictions) {
                        _this.targetPredictions = predictions;
                    }, function (error) {
                        _this.targetPredictions = [];
                    });
                }
            };
            LandingController.prototype.isCountry = function (place) {
                for (var typeId = 0; typeId < place.types.length; ++typeId) {
                    if (place.types[typeId] === 'country') {
                        return true;
                    }
                }
                return false;
            };
            LandingController.prototype.setStartPlace = function (place) {
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
                        _this.StartLatLng = place.geometry.location;
                        _this.StartCountry = _this.utilService.getPlaceCountry(place);
                        _this.redirectIfReady();
                    }
                });
            };
            LandingController.prototype.setTargetPlace = function (place) {
                var _this = this;
                this.gacService.details(place.place_id).then(function (result) {
                    var place = result;
                    if (_this.isCountry(place)) {
                        _this.gacValidationMessage = 'Ein Land kann nicht als Ziel gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        _this.gacValidationMessage = '';
                        var location = place.geometry.location;
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
                        _this.TargetCountry = _this.utilService.getPlaceCountry(place);
                        _this.redirectIfReady();
                    }
                });
            };
            LandingController.prototype.cumulativeOffset = function (element) {
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
            ;
            LandingController.prototype.onDownArrowClick = function () {
                var _this = this;
                this.timeoutService(function () {
                    var nav = document.getElementById('mainNavbar');
                    var navHeight = nav.clientHeight;
                    var elm = document.getElementById('downArrow');
                    var st = _this.cumulativeOffset(elm).top; // - navHeight - 10;
                    //$log.info('nav is ' + navHeight + ' high, jumping to ' + st);
                    $("body,html").animate({ scrollTop: st }, "slow");
                });
            };
            LandingController.$inject = ['$location', '$routeParams', '$timeout', 'RequestService', 'gacService', 'AnalyticsService', 'UtilService'];
            return LandingController;
        })();
        angular.module('pfb').controller('LandingController', LandingController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
