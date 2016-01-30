(function () {
    'use strict';

    angular
        .module('RequestApp')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['$routeParams', '$location', '$timeout', '$q', '$log', '$window', 'gacFactory', 'requestFactory', 'utilFactory', 'analyticsFactory'];

    function LandingController($routeParams, $location, $timeout, $q, $log, $window, gacFactory, requestFactory, util, analytics) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'LandingController';
        vm.requestId = '';
        vm.startIsValid = false;
        vm.targetIsValid = false;
        vm.StartLatLng = null;
        vm.TargetLatLng = null;
        vm.StartCountry = '';
        vm.TargetCountry = '';
        vm.mapSubmitted = false;
        vm.mapLoading = false;
        vm.startAutocomplete = null;
        vm.targetAutocomplete = null;
        vm.startPredictions = [];
        vm.targetPredictions = [];
        vm.gacValidationMessage = '';
        vm.ValueTrack = {};

        activate();

        function activate() {
            var valuetrack = $location.search();
            if (valuetrack.hasOwnProperty('k')) {
                vm.ValueTrack.KeyWord = valuetrack.k;
            }
            if (valuetrack.hasOwnProperty('d')) {
                vm.ValueTrack.Device = valuetrack.d;
            }
            if (valuetrack.hasOwnProperty('m')) {
                vm.ValueTrack.MatchType = valuetrack.m;
            }

            $location.search('k', null);
            $location.search('d', null);
            $location.search('m', null);

            if ($routeParams.startSearch != '') {
                gacFactory.autocomplete($routeParams.startSearch)
                    .success(function (data, status, headers, config) {
                        if (data.status == "OK") {
                            vm.setStartPlace(data.predictions[0]);
                        }
                    });
            }

            if ($routeParams.targetSearch != '') {
                gacFactory.autocomplete($routeParams.targetSearch)
                    .success(function (data, status, headers, config) {
                        if (data.status == "OK") {
                            vm.setTargetPlace(data.predictions[0]);
                        }
                    });
            }
            
            $("body,html").scrollTop(0);
        }

        vm.redirectIfReady = function (postBack) {
            if (vm.StartLatLng == null || vm.TargetLatLng == null) {
                vm.distance = 0;
                vm.duration = 0;
                return;
            }

            analytics.buttonClick('landing');

            vm.mapLoading = true;

            requestFactory.create()
                .success(function (data) {
                    vm.requestId = data;
                })
                .then(function () {
                    var newData = $.extend({}, vm.ValueTrack, {
                        RequestId: vm.requestId,
                        StartName: vm.StartName,
                        StartCountry: vm.StartCountry,
                        StartLat: vm.StartLat,
                        StartLon: vm.StartLon,
                        TargetName: vm.TargetName,
                        TargetCountry: vm.TargetCountry,
                        TargetLat: vm.TargetLat,
                        TargetLon: vm.TargetLon
                    });
                    return requestFactory.update(newData);
                })
                .then(function (data) {
                    if (data.data.status == 'CannotQuote') {
                        $location.path('/cannotQuote/' + vm.requestId);
                    } else {
                        $location.path('/request');
                        $location.search('r', vm.requestId);
                        $location.search('s', 'd');
                    }
                });
        }

        vm.query = function (searchText) {
            if (searchText != '') {
                return gacFactory.autocomplete(searchText)
                    .then(function (response) {
                        return response.data.predictions;
                    });
            } else {
                return [];
            }
        }

        //vm.$on('$viewContentLoaded', function (event) {
        //    analytics.pageView();
        //});
        
        vm.submitMap = function () {
            vm.mapSubmitted = true;
        };

        vm.isCountry = function (place) {
            for (var typeId = 0; typeId < place.types.length; ++typeId) {
                if (place.types[typeId] === 'country') {
                    return true;
                }
            }
            return false;
        }

        vm.setStartPlace = function (place) {
            gacFactory.details(place.place_id)
            .success(function (data) {
                if (data.status == "OK") {
                    var place = data.result;
                    if (vm.isCountry(place)) {
                        vm.gacValidationMessage = 'Ein Land kann nicht als Abfahrtsort gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        vm.gacValidationMessage = '';
                        vm.StartLat = place.geometry.location.lat;
                        vm.StartLon = place.geometry.location.lng;
                        if (place.formatted_address === 'Deutschland') {
                            vm.StartName = place.name + ', ' + place.formatted_address;
                        } else {
                            vm.StartName = place.formatted_address;
                        }
                        vm.startIsValid = true;
                        vm.startPredictions = [];
                        vm.StartLatLng = place.geometry.location;
                        vm.StartCountry = util.getPlaceCountry(place);
                        vm.redirectIfReady();
                    }
                }
            })
        }

        vm.setTargetPlace = function (place) {
            gacFactory.details(place.place_id)
            .success(function (data) {
                if (data.status == "OK") {
                    var place = data.result;
                    if (vm.isCountry(place)) {
                        vm.gacValidationMessage = 'Ein Land kann nicht als Ziel gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        vm.gacValidationMessage = '';
                        vm.TargetLat = place.geometry.location.lat;
                        vm.TargetLon = place.geometry.location.lng;
                        if (place.formatted_address === 'Deutschland') {
                            vm.TargetName = place.name + ', ' + place.formatted_address;
                        } else {
                            vm.TargetName = place.formatted_address;
                        }
                        vm.targetIsValid = true;
                        vm.targetPredictions = [];
                        vm.TargetLatLng = place.geometry.location;
                        vm.TargetCountry = util.getPlaceCountry(place);
                        vm.redirectIfReady();
                    }
                }
            })
        }

        vm.cumulativeOffset = function (element) {
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

        vm.onDownArrowClick = function () {
            $timeout(function () {
                var nav = document.getElementById('mainNavbar');
                var navHeight = nav.clientHeight;
                var elm = document.getElementById('downArrow');
                var st = vm.cumulativeOffset(elm).top;// - navHeight - 10;
                $log.info('nav is ' + navHeight + ' high, jumping to ' + st);
                $("body,html").animate({ scrollTop: st }, "slow");
            });
        }
    }
})();
