declare var PFBConfig: pfb.Models.IPFBConfig;

module pfb.Services {

    export interface IRequestService {
        create(): ng.IPromise<any>;
        update(data: Models.IRequest): ng.IPromise<any>;
        get(id: string): ng.IPromise<Models.IRequest>;
        offers(id: string): ng.IPromise<Models.IOffer[]>;
        offer(id: string, oid: number): ng.IPromise<Models.IOffer>;
    }

    class RequestService {
        static $inject = ['$http', '$q'];
        constructor(
            private httpService: ng.IHttpService,
            private qService: ng.IQService
        ) {
        }

        create(): ng.IPromise<string> {
            var deferred = this.qService.defer();
            this.httpService.post(PFBConfig.apiEndpoint + 'request/new', {
                ClientId: PFBConfig.clientId
            }).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        update(data: Models.IRequest): ng.IPromise<any> {
            return this.httpService.post(PFBConfig.apiEndpoint + 'request', data);
        }

        get(id: string): ng.IPromise<Models.IRequest> {
            var deferred = this.qService.defer();
            this.httpService.post(PFBConfig.apiEndpoint + 'request', {
                RequestId: id
            }).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        offers(id: string): ng.IPromise<Models.IOffer[]> {
            var deferred = this.qService.defer();
            this.httpService.post(PFBConfig.apiEndpoint + 'offer?RequestId=' + id, null).then(
                (result) => {
                    var offers: any = result.data;
                    var desc = '<b>Kein Angebot m&ouml;glich.</b>' +
                        '<div>In dieser Kategorie k&ouml;nnen wir Ihnen momentan leider kein Sofortangebot unterbreiten. Bitte kontaktieren Sie uns f&uuml;r ein individuelles Angebot.</div>';

                    if (offers.length < 1) {
                        offers.push({
                            productName: 'Standard',
                            productDescription: desc,
                            noOffer: true
                        })
                    }

                    if (offers.length < 2) {
                        offers.push({
                            productName: 'Komfort',
                            productDescription: desc,
                            noOffer: true
                        })
                    }

                    if (offers.length < 3) {
                        offers.push({
                            productName: 'Luxus',
                            productDescription: desc,
                            noOffer: true
                        })
                    };

                    deferred.resolve(offers);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };

        offer(id: string, oid: number): ng.IPromise<Models.IOffer> {
            var deferred = this.qService.defer();
            this.httpService.post(PFBConfig.apiEndpoint + 'offer?RequestId=' + id + '&OfferId=' + oid, null).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    }
    angular.module('pfb').service('RequestService', RequestService);
}