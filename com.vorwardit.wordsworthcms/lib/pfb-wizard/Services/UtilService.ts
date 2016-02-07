module pfb.Services {

    export interface IUtilService {
        jumpTo(eName: string): void;
        scrollTo(eName: string): void;
        preloadImage(url: string): ng.IPromise<any>;
        getPlaceCountry(place: google.maps.places.PlaceResult): string;
        isoDateString(date): string;
    }

    class UtilService {
        static $inject = ['$timeout', '$log', '$q'];
        constructor(
            private timeoutService: ng.ITimeoutService,
            private logService: ng.ILogService,
            private qService: ng.IQService
        ) {
        }

        cumulativeOffset(element: any): any {
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

        jumpTo(eName: string): void {
            this.timeoutService(() => {
                var nav = document.getElementById('mainNavbar');
                var navHeight = nav.clientHeight;
                var elm = document.getElementById(eName);
                var st = this.cumulativeOffset(elm).top - navHeight - 10;
                this.logService.info('nav is ' + navHeight + ' high, jumping to ' + st);
                $("body,html").scrollTop(st);
            }, 500);
        }

        scrollTo(eName: string): void {
            this.timeoutService(() => {
                var nav = document.getElementById('mainNavbar');
                var navHeight = nav.clientHeight;
                var elm = document.getElementById(eName);
                var st = this.cumulativeOffset(elm).top - navHeight - 10;
                this.logService.info('nav is ' + navHeight + ' high, scolling to ' + st);
                $("body,html").animate({ scrollTop: st }, "slow");
            }, 500);
        }

        preloadImage(url: string): ng.IPromise<any> {
            var deffered = this.qService.defer(),
                image = new Image();

            image.src = url;
            if (image.complete) {
                deffered.resolve();
            } else {
                image.addEventListener('load', function () {
                    deffered.resolve();
                });

                image.addEventListener('error', function () {
                    deffered.reject();
                });
            }
            return deffered.promise;
        };

        getPlaceCountry(place: google.maps.places.PlaceResult): string {
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == 'country') {
                        return place.address_components[i].short_name;
                    }
                }
            }
            return 'UNKNOWN';
        }

        isoDateString(date): string {
            if (typeof (date) == 'undefined') {
                return null;
            }
            var curr_date = date.getDate();
            var curr_month = date.getMonth();
            var curr_year = date.getFullYear();
            return curr_year + "-" + (curr_month + 1) + "-" + curr_date;
        }
    }
    angular.module('pfb').service('UtilService', UtilService);
}