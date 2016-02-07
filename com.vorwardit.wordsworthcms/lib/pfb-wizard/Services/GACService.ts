declare var PFBConfig: pfb.Models.IPFBConfig;

module pfb.Services {

    export interface IGACService {
        autocomplete(input: string): ng.IPromise<google.maps.places.AutocompletePrediction[]>;
        details(id: string): ng.IPromise<google.maps.places.PlaceResult>;
    }

    class GACService {
        static $inject = ['$http', '$q'];
        constructor(
            private httpService: ng.IHttpService,
            private qService: ng.IQService
        ) {
        }

        autocomplete(input: string): ng.IPromise<google.maps.places.AutocompletePrediction[]> {
            var deferred = this.qService.defer();
            this.httpService.post(
                PFBConfig.apiEndpoint + 'maps/autocomplete', {
                Input: input
            }).then(
                (result) => {
                    if (result.statusText == "OK") {
                        if (result.data["status"] == "OK") {
                            deferred.resolve(result.data["predictions"]);
                        } else {
                            deferred.reject(result.data["status"]);
                        }
                    } else {
                        deferred.reject(result.statusText);
                    }
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };

        details(id: string): ng.IPromise<google.maps.places.PlaceResult> {
            var deferred = this.qService.defer();
            this.httpService.post(PFBConfig.apiEndpoint + 'maps/details', {
                PlaceId: id
            }).then(
                (result) => {
                    if (result.statusText == "OK") {
                        if (result.data["status"] == "OK") {
                            deferred.resolve(result.data["result"]);
                        } else {
                            deferred.reject(result.data["status"]);
                        }
                    } else {
                        deferred.reject(result.statusText);
                    }
                },
                (error) => {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }

    angular.module('pfb').service('gacService', GACService);
}