module pfb.Controllers {
    class RequestController {

        locked: boolean = true;
        requestId: string = '';
        startIsValid: boolean = false;
        targetIsValid: boolean = false;
        startPredictions: google.maps.places.AutocompletePrediction[] = [];
        targetPredictions: google.maps.places.AutocompletePrediction[] = [];
        StartCountry: string = '';
        TargetCountry: string = '';
        showMap: boolean = false;
        showNameSection: boolean = false;
        distance: number = 0;
        duration: number = 0;
        map: any = null;
        StartLatLng: google.maps.LatLng = null;
        TargetLatLng: google.maps.LatLng = null;
        ds: google.maps.DirectionsService = new google.maps.DirectionsService();
        dr: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer();
        Request: ng.IFormController;
        offers: Models.IOffer[] = [];
        initFinished: boolean = false;
        mapLoading: boolean = false;
        offersLoading: boolean = false;
        requestNumber: number = 0;
        gacValidationMessage: string = '';
        dateSectionSubmitted = false;
        startTimeArrive: string = '';
        startTimeDepart: string = '';
        returnTimeArrive: string = '';
        returnTimeDepart: string = '';
        nameSectionSubmitted: boolean = false;
        isMailFormShown: boolean = false;
        emailForSending: string = "";
        emailBeingSent: boolean = false;
        mailSendSuccess: boolean = false;
        StartLat: number;
        StartLon: number;
        TargetLat: number;
        TargetLon: number;
        showOfferSection: boolean = false;
        dateOptionsStart: any;
        dateOptionsReturn: any;
        StartTimeMode: string;
        ReturnTimeMode: string;
        busShouldStay: boolean = false;
        isOneWay: boolean = false;
        StartTime: string;
        ReturnTime: string;

        static $inject = [
            '$location', '$log', '$sce', '$q', '$timeout', '$window',
            'RequestService', 'gacService', 'UtilService', 'AnalyticsService', 'MailerService'];
        constructor(
            private locationService: ng.ILocationService,
            private logService: ng.ILogService,
            private sceService: ng.ISCEService,
            private qService: ng.IQService,
            private timeoutService: ng.ITimeoutService,
            private windowService: ng.IWindowService,
            private requestService: Services.IRequestService,
            private gacService: Services.IGACService,
            private utilService: Services.IUtilService,
            private analyticsService: Services.IAnalyticsService,
            private mailerService: Services.IMailerService
        ) {
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

        startErrorClass(): string {
            if (this.startIsValid) {
                return 'has-success';
            } else {
                return 'has-error'
            }
        };

        targetErrorClass(): string {
            if (this.targetIsValid) {
                return 'has-success';
            } else {
                return 'has-error'
            }
        };

        onStartNameEdit(): void {
            if (!this.initFinished) {
                return;
            }
            this.gacValidationMessage = '';
            var newValue = this.Request["StartName"].$modelValue;
            this.startIsValid = false;
            this.getRequestId().then(
                () => {
                    this.setStatus('');
                    if (newValue != '') {
                        this.gacService.autocomplete(newValue).then(
                            (predictions) => {
                                this.startPredictions = predictions;
                            },
                            (error) => {
                                this.startPredictions = [];
                            });
                    }
                });
        }

        onTargetNameEdit(): void {
            if (!this.initFinished) {
                return;
            }
            this.gacValidationMessage = '';
            var newValue = this.Request["TargetName"].$modelValue;
            this.targetIsValid = false;
            this.getRequestId().then(
                () => {
                    this.setStatus('');
                    if (newValue != '') {
                        this.targetIsValid = false;
                        this.gacService.autocomplete(newValue).then(
                            (predictions) => {
                                this.targetPredictions = predictions;
                            },
                            (error) => {
                                this.targetPredictions = [];
                            });
                    }
                });
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
                        this.StartLatLng = new google.maps.LatLng(location.lat, location.lng);
                        this.StartCountry = this.utilService.getPlaceCountry(place);
                        this.renderMapIfReady(true);
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
                        var location: any = place.geometry.location; // TS defs out of sync :(
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
                        this.TargetLatLng = new google.maps.LatLng(location.lat, location.lng);
                        this.TargetCountry = this.utilService.getPlaceCountry(place);
                        this.renderMapIfReady(true);
                    }
                });
        }

        setStatus(status: string): void {
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
                this.requestService.offers(this.requestId).then((data) => {
                    this.offers = data;
                    angular.forEach(this.offers, (value) => {
                        value.safeProductDescription = this.sceService.trustAsHtml(value.productDescription);
                    });
                    this.offersLoading = false;
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
        }

        pad2Digits(num: number): string {
            var s = "0" + num;
            return s.substr(s.length - 2);
        }

        getRequestId(): ng.IPromise<void> {
            var deferred = this.qService.defer<void>();
            if (this.locked) {
                this.requestService.create().then(
                    (id) => {
                        this.locationService.search('r', id);
                        this.requestId = id;
                        this.locked = false;
                        this.showOfferSection = false;
                    },
                    (error) => {
                        deferred.reject(error);
                    });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        };

        save(newStatus?: string): ng.IPromise<Models.IRequest> {
            var deferred = this.qService.defer<Models.IRequest>();

            this.getRequestId().then(
                () => {
                    var startDate = this.Request["StartDate"].$modelValue;
                    var newData = {
                        requestId: this.requestId,
                        startName: this.Request["StartName"].$modelValue,
                        startCountry: this.StartCountry,
                        startLat: this.StartLat,
                        startLon: this.StartLon,
                        targetName: this.Request["TargetName"].$modelValue,
                        targetCountry: this.TargetCountry,
                        targetLat: this.TargetLat,
                        targetLon: this.TargetLon,
                        distance: this.distance,
                        duration: this.duration,
                        startDate: this.utilService.isoDateString(this.Request["StartDate"].$modelValue),
                        startTime: this.StartTime,
                        startTimeMode: this.StartTimeMode,
                        returnDate: this.utilService.isoDateString(this.Request["ReturnDate"].$modelValue),
                        returnTime: this.ReturnTime,
                        returnTimeMode: this.ReturnTimeMode,
                        passengers: this.Request["Passengers"].$modelValue,
                        name: this.Request["Name"].$modelValue,
                        email: this.Request["EMail"].$modelValue,
                        phone: this.Request["Telephone"].$modelValue,
                        tripType: this.isOneWay ? 'OneWay' : 'Return',
                        busShouldStay: this.busShouldStay
                    }
                    return this.requestService.update(newData);
                },
                (error) => {
                    deferred.reject(error);
                }
            ).then(
                (request) => {
                    if (request.status == 'CannotQuote') {
                        this.locationService.path('/cannotQuote/' + this.requestId);
                        this.locationService.search({});
                    }
                    this.startTimeArrive = request.startTimeArrive;
                    this.startTimeDepart = request.startTimeDepart;
                    this.returnTimeArrive = request.returnTimeArrive;
                    this.returnTimeDepart = request.returnTimeDepart;
                    this.requestNumber = request.number;
                    if (newStatus) {
                        this.setStatus(newStatus.valueOf());
                    }
                    deferred.resolve(request);
                },
                (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        invalidate(fieldName: string): void {
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
            } else if (fieldName === 'target') {
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

        displayDistance(): string {
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
        }

        renderMapIfReady(postBack: boolean) {
            if (this.StartLatLng == null || this.TargetLatLng == null) {
                this.distance = 0;
                this.duration = 0;
                return;
            }
            this.mapLoading = true;
            this.showMap = true;

            this.timeoutService(() => {
                if (this.map == null) {
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

                    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    this.dr.setMap(this.map);
                }

                if (postBack) {
                    this.utilService.scrollTo('mapPanel');
                }

                this.ds.route({
                    origin: this.StartLatLng,
                    destination: this.TargetLatLng,
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC
                }, (result, status) => {
                    if (status == google.maps.DirectionsStatus.OK) {
                        this.dr.setDirections(result);
                        if (postBack) {
                            this.save().then((data) => {
                                this.distance = data.distance;
                                this.duration = data.duration;

                                this.setStatus('d');
                                this.mapLoading = false;
                            });
                        } else {
                            this.mapLoading = false;
                        };
                    }
                    else {
                        this.distance = 0;
                        this.duration = 0;
                        this.mapLoading = false;
                        }
                    });
            });
        }

        startDateChanged(val): void {
            this.dateOptionsReturn.minDate = val;
            this.Request["ReturnDate"].$setViewValue(val);
            this.Request["ReturnDate"].$render();
            this.invalidate('dates');
        }

        returnDateChanged(val): void {
            this.dateOptionsStart.maxDate = val;
            this.invalidate('dates');
        }

        isDateSectionValid(): boolean {
            return this.Request["StartDate"].$valid && this.Request["ReturnDate"].$valid;
        };

        startDateErrorClass(): string {
            if (!this.Request["StartDate"].$dirty && !this.dateSectionSubmitted) {
                return '';
            }
            if (this.Request["StartDate"].$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        returnDateErrorClass(): string {
            if (!this.Request["ReturnDate"].$dirty && !this.dateSectionSubmitted) {
                return '';
            }
            if (this.Request["ReturnDate"].$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        submitDateSection() {
            this.dateSectionSubmitted = true;
            this.analyticsService.buttonclick('dates');
            if (this.isDateSectionValid()) {
                this.save('n');
            }
        }

        passengersEdited(): void {
            if (!this.initFinished) {
                return;
            }

            if (this.locked) {
                this.nameSectionSubmitted = false;
                this.getRequestId().then(() => {
                    this.save('n');
                });
            }
        }

        passengerErrorClass(): string {
            if (!this.Request["Passengers"].$dirty && !this.nameSectionSubmitted) {
                return '';
            }
            if (this.Request["Passengers"].$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        nameErrorClass(): string {
            if (!this.Request["Name"].$dirty && !this.nameSectionSubmitted) {
                return '';
            }
            if (this.Request["Name"].$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        emailErrorClass(): string {
            if (!this.Request["EMail"].$dirty && !this.nameSectionSubmitted) {
                return '';
            }
            if (this.Request["EMail"].$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        telephoneErrorClass(): string {
            if (!this.Request["Telephone"].$dirty && !this.nameSectionSubmitted) {
                return '';
            }
            if (this.Request["Telephone"].$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        nameSectionValid(): boolean {
            return this.Request.$valid;
        }

        submitNameSection(): void {
            this.nameSectionSubmitted = true;
            this.analyticsService.buttonclick('passengers');
            if (this.nameSectionValid()) {
                this.offersLoading = true;
                this.save().then(() => {
                    this.analyticsService.offersdisplayed();
                    this.setStatus('o');
                });
            }
        }

        detectInitialState(): void {
            var state = this.locationService.search();
            if (state.hasOwnProperty('r')) {
                this.requestId = state.r;
                this.requestService.get(state.r).then(
                    (data) => {
                        this.requestNumber = data.number;
                        if (data.hasOwnProperty('startLat')) {
                            this.Request["StartName"].$setViewValue(data.startName);
                            this.Request["StartName"].$render();
                            this.StartCountry = data.startCountry;
                            this.StartLat = data.startLat;
                            this.StartLon = data.startLon;
                            this.StartLatLng = new google.maps.LatLng(data.startLat, data.startLon);
                            this.startIsValid = true;
                            this.Request["TargetName"].$setViewValue(data.targetName);
                            this.Request["TargetName"].$render();
                            this.TargetCountry = data.targetCountry;
                            this.TargetLat = data.targetLat;
                            this.TargetLon = data.targetLon;
                            this.TargetLatLng = new google.maps.LatLng(data.targetLat, data.targetLon);
                            this.targetIsValid = true;
                            this.distance = data.distance;
                            this.duration = data.duration;
                            this.renderMapIfReady(false);
                        }
                        if (data.startDate != null) {
                            var sDate = new Date(data.startDate);
                            var rDate = new Date(data.returnDate);
                            this.Request["StartDate"].$setViewValue(sDate);
                            this.Request["StartDate"].$render();
                            this.StartTime = this.pad2Digits(sDate.getUTCHours()) + ':' + this.pad2Digits(sDate.getUTCMinutes());
                            this.Request["ReturnDate"].$setViewValue(rDate);
                            this.Request["ReturnDate"].$render();
                            this.ReturnTime = this.pad2Digits(rDate.getUTCHours()) + ':' + this.pad2Digits(rDate.getUTCMinutes());
                            this.startTimeArrive = data.startTimeArrive;
                            this.startTimeDepart = data.startTimeDepart;
                            this.returnTimeArrive = data.returnTimeArrive;
                            this.returnTimeDepart = data.returnTimeDepart;

                            this.StartTimeMode = data.startTimeMode;
                            this.ReturnTimeMode = data.returnTimeMode;
                        }
                        this.busShouldStay = data.busShouldStay;
                        if (data.tripType == 'OneWay') {
                            this.isOneWay = true;
                        }
                        else {
                            this.isOneWay = false;
                        }
                        if (data.passengers > 0) {
                            this.Request["Passengers"].$setViewValue(data.passengers);
                            this.Request["Passengers"].$render();
                        }
                        this.Request["Name"].$setViewValue(data.name);
                        this.Request["Name"].$render();
                        this.Request["EMail"].$setViewValue(data.email);
                        this.Request["EMail"].$render();
                        this.Request["Telephone"].$setViewValue(data.phone);
                        this.Request["Telephone"].$render();
                        this.locked = data.isLocked;
                        if (this.locked) {
                            if (state.s === 'recalc') {
                                this.locationService.search('s', 'n');
                                state.s = 'n';
                                data.isOfferExpired = false;
                            }
                            else {
                                this.locationService.search('s', 'o');
                                state.s = 'o';
                            }
                        }
                        if (state.s === 'd') {
                            this.utilService.scrollTo('mapPanel');
                            this.analyticsService.pageview('/app/dates');
                        }
                        else if (state.s === 'n') {
                            this.showNameSection = true;
                            this.utilService.jumpTo('namePanel');
                            this.analyticsService.pageview('/app/passengers');
                        }
                        else if (state.s === 'o') {
                            this.locked = true;
                            this.offersLoading = true;
                            this.requestService.offers(this.requestId).then((data) => {
                                this.offers = data;
                                angular.forEach(this.offers, (value) => {
                                    value.safeProductDescription = this.sceService.trustAsHtml(value.productDescription);
                                });
                                this.offersLoading = false;
                            });
                            this.showNameSection = true;
                            this.showOfferSection = true;
                            this.utilService.jumpTo('offerPanel');
                            this.analyticsService.pageview('/app/offers');
                        }
                        else {
                            this.analyticsService.pageview('/app/places');
                        }
                        if (data.isOfferExpired) {
                            this.locationService.path('/offerExpired/' + this.requestId);
                        }
                        this.initFinished = true;
                    },
                    (error) => {
                        this.logService.error(error)
                    });
            }
            else {
                this.initFinished = true;
                this.analyticsService.pageview('/app/places');
            }
        }

        print(): void {
            this.windowService.print();
        };

        showMailForm(): void {
            this.emailForSending = this.Request["EMail"].$modelValue;
            this.isMailFormShown = true;
        }

        sendMail(): void {
            this.emailBeingSent = true;
            this.mailerService.sendMail({
                Id: this.requestId,
                Type: 'offer',
                Email: this.emailForSending
            }).then(() => {
                this.emailBeingSent = false;
                this.mailSendSuccess = true;
                this.timeoutService(() => {
                    this.mailSendSuccess = false;
                    this.isMailFormShown = false;
                }, 2000);
                });
        }
    }
    angular.module('pfb').controller('RequestController', RequestController);
}