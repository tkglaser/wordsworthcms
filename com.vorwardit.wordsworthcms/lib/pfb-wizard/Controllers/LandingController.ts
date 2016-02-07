module pfb.Controllers {
    class LandingController {

        Request: ng.IFormController;
        requestId: string = '';
        startIsValid: boolean = false;
        targetIsValid: boolean = false;
        StartLatLng: any = null;
        TargetLatLng: any = null;
        StartCountry: string = '';
        TargetCountry: string = '';
        mapSubmitted: boolean = false;
        mapLoading: boolean = false;
        startAutocomplete: any = null;
        targetAutocomplete: any = null;
        startPredictions: google.maps.places.AutocompletePrediction[] = [];
        targetPredictions: google.maps.places.AutocompletePrediction[] = [];
        gacValidationMessage: string = '';
        ValueTrack: any = {};
        distance: number = 0;
        duration: number = 0;
        StartLat: number;
        StartLon: number;
        TargetLat: number;
        TargetLon: number;

        static $inject = ['$location', '$routeParams', '$timeout', 'RequestService', 'gacService', 'AnalyticsService', 'UtilService'];
        constructor(
            private locationService: ng.ILocationService,
            private routeParamsService: ng.route.IRouteParamsService,
            private timeoutService: ng.ITimeoutService,
            private requestService: Services.IRequestService,
            private gacService: Services.IGACService,
            private analyticsService: Services.IAnalyticsService,
            private utilService: Services.IUtilService
        ) {

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
                this.gacService.autocomplete(this.routeParamsService["startSearch"]).then(
                    (predictions) => {
                        this.setStartPlace(predictions[0]);
                    });
            }

            if (this.routeParamsService["targetSearch"] != '') {
                this.gacService.autocomplete(this.routeParamsService["targetSearch"]).then(
                    (predictions) => {
                        this.setTargetPlace(predictions[0]);
                    });
            }

            // TODO
            //this.$on('$viewContentLoaded', function (event) {
            //    this.analyticsService.pageView();
            //});

            $("body,html").scrollTop(0);
        }

        startErrorClass(): string {
            if (!this.Request["StartName"].$dirty && !this.mapSubmitted) {
                return '';
            }
            if (this.startIsValid) {
                return 'has-success';
            } else {
                return 'has-error'
            }
        };

        targetErrorClass(): string {
            if (!this.Request["TargetName"].$dirty && !this.mapSubmitted) {
                return '';
            }
            if (this.targetIsValid) {
                return 'has-success';
            } else {
                return 'has-error'
            }
        };

        submitMap(): void {
            this.mapSubmitted = true;
        };

        redirectIfReady(): void {
            if (this.StartLatLng == null || this.TargetLatLng == null) {
                this.distance = 0;
                this.duration = 0;
                return;
            }

            this.analyticsService.buttonclick('landing');

            this.mapLoading = true;

            this.requestService.create()
                .then((data) => {
                    this.requestId = data;
                    var newData = $.extend({}, this.ValueTrack, {
                        RequestId: this.requestId,
                        StartName: this.Request["StartName"].$modelValue,
                        StartCountry: this.StartCountry,
                        StartLat: this.StartLat,
                        StartLon: this.StartLon,
                        TargetName: this.Request["TargetName"].$modelValue,
                        TargetCountry: this.TargetCountry,
                        TargetLat: this.TargetLat,
                        TargetLon: this.TargetLon
                    });
                    return this.requestService.update(newData);
                }).then((data) => {
                    if (data.data.status == 'CannotQuote') {
                        this.locationService.path('/cannotQuote/' + this.requestId);
                    } else {
                        this.locationService.path('/request');
                        this.locationService.search('r', this.requestId);
                        this.locationService.search('s', 'd');
                    }
                });
        }

        onStartNameEdit(): void {
            this.startIsValid = false;
            this.gacValidationMessage = '';
            var newValue = this.Request["StartName"].$modelValue;
            if (newValue != '') {
                this.gacService.autocomplete(newValue).then(
                    (predictions) => {
                        this.startPredictions = predictions;
                    },
                    (error) => {
                        this.startPredictions = [];
                    });
            }
        }

        onTargetNameEdit(): void {
            this.targetIsValid = false;
            this.gacValidationMessage = '';
            var newValue = this.Request["TargetName"].$modelValue;
            if (newValue != '') {
                this.gacService.autocomplete(newValue).then(
                    (predictions) => {
                        this.targetPredictions = predictions;
                    },
                    (error) => {
                        this.targetPredictions = [];
                    });
            }
        }

        isCountry(place: google.maps.places.PlaceResult): boolean {
            for (var typeId = 0; typeId < place.types.length; ++typeId) {
                if (place.types[typeId] === 'country') {
                    return true;
                }
            }
            return false;
        }

        setStartPlace(place: google.maps.places.AutocompletePrediction): void {
            this.gacService.details(place.place_id).then(
                (result) => {
                    var place = result;
                    if (this.isCountry(place)) {
                        this.gacValidationMessage = 'Ein Land kann nicht als Abfahrtsort gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        this.gacValidationMessage = '';
                        var location: any = place.geometry.location;
                        this.StartLat = location.lat;
                        this.StartLon = location.lng;
                        if (place.formatted_address === 'Deutschland') {
                            this.Request["StartName"].$setViewValue(place.name + ', ' + place.formatted_address);
                        } else {
                            this.Request["StartName"].$setViewValue(place.formatted_address);
                        }
                        this.Request["StartName"].$render();
                        this.startIsValid = true;
                        this.startPredictions = [];
                        this.StartLatLng = place.geometry.location;
                        this.StartCountry = this.utilService.getPlaceCountry(place);
                        this.redirectIfReady();
                    }
                });
        }

        setTargetPlace(place: google.maps.places.AutocompletePrediction): void {
            this.gacService.details(place.place_id).then(
                (result) => {
                    var place = result;
                    if (this.isCountry(place)) {
                        this.gacValidationMessage = 'Ein Land kann nicht als Ziel gewählt werden!';
                        return;
                    }
                    if (place.geometry) {
                        this.gacValidationMessage = '';
                        var location: any = place.geometry.location;
                        this.TargetLat = location.lat;
                        this.TargetLon = location.lng;
                        if (place.formatted_address === 'Deutschland') {
                            this.Request["TargetName"].$setViewValue(place.name + ', ' + place.formatted_address);
                        } else {
                            this.Request["TargetName"].$setViewValue(place.formatted_address);
                        }
                        this.Request["TargetName"].$render();
                        this.targetIsValid = true;
                        this.targetPredictions = [];
                        this.TargetLatLng = place.geometry.location;
                        this.TargetCountry = this.utilService.getPlaceCountry(place);
                        this.redirectIfReady();
                    }
                });
        }

        cumulativeOffset(element) {
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

        onDownArrowClick(): void {
            this.timeoutService(() => {
                var nav = document.getElementById('mainNavbar');
                var navHeight = nav.clientHeight;
                var elm = document.getElementById('downArrow');
                var st = this.cumulativeOffset(elm).top;// - navHeight - 10;
                //$log.info('nav is ' + navHeight + ' high, jumping to ' + st);
                $("body,html").animate({ scrollTop: st }, "slow");
            });
        }
    }
    angular.module('pfb').controller('LandingController', LandingController);
}