var pfb;
(function (pfb) {
    var Services;
    (function (Services) {
        var RequestService = (function () {
            function RequestService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            RequestService.prototype.create = function () {
                var deferred = this.qService.defer();
                this.httpService.post(PFBConfig.apiEndpoint + 'request/new', {
                    ClientId: PFBConfig.clientId
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            ;
            RequestService.prototype.update = function (data) {
                return this.httpService.post(PFBConfig.apiEndpoint + 'request', data);
            };
            RequestService.prototype.get = function (id) {
                var deferred = this.qService.defer();
                this.httpService.post(PFBConfig.apiEndpoint + 'request', {
                    RequestId: id
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            RequestService.prototype.offers = function (id) {
                var deferred = this.qService.defer();
                this.httpService.post(PFBConfig.apiEndpoint + 'offer?RequestId=' + id, null).then(function (result) {
                    var offers = result.data;
                    var desc = '<b>Kein Angebot m&ouml;glich.</b>' +
                        '<div>In dieser Kategorie k&ouml;nnen wir Ihnen momentan leider kein Sofortangebot unterbreiten. Bitte kontaktieren Sie uns f&uuml;r ein individuelles Angebot.</div>';
                    if (offers.length < 1) {
                        offers.push({
                            productName: 'Standard',
                            productDescription: desc,
                            noOffer: true
                        });
                    }
                    if (offers.length < 2) {
                        offers.push({
                            productName: 'Komfort',
                            productDescription: desc,
                            noOffer: true
                        });
                    }
                    if (offers.length < 3) {
                        offers.push({
                            productName: 'Luxus',
                            productDescription: desc,
                            noOffer: true
                        });
                    }
                    ;
                    deferred.resolve(offers);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            ;
            RequestService.prototype.offer = function (id, oid) {
                var deferred = this.qService.defer();
                this.httpService.post(PFBConfig.apiEndpoint + 'offer?RequestId=' + id + '&OfferId=' + oid, null).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            RequestService.$inject = ['$http', '$q'];
            return RequestService;
        })();
        angular.module('pfb').service('RequestService', RequestService);
    })(Services = pfb.Services || (pfb.Services = {}));
})(pfb || (pfb = {}));
