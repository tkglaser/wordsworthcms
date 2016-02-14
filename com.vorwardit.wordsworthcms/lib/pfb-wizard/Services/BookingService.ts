declare var PFBConfig: pfb.Models.IPFBConfig;

module pfb.Services {

    export interface IBookingService {
        book(data: Models.IBooking): ng.IPromise<any>;
        pay(data: Models.IPayment): ng.IPromise<any>;
    }

    class BookingService {
        static $inject = ['$http', '$q'];
        constructor(
            private httpService: ng.IHttpService,
            private qService: ng.IQService
        ) {
        }

        book(data: Models.IBooking): ng.IPromise<any> {
            var deferred = this.qService.defer();
            this.httpService.post(PFBConfig.apiEndpoint + 'booking', data).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        pay(data: Models.IPayment): ng.IPromise<any> {
            return this.httpService.post(PFBConfig.apiEndpoint + 'paymentresult', data);
        }
    }

    angular.module('pfb').service('BookingService', BookingService);
}
