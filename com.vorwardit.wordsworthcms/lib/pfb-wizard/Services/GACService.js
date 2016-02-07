var pfb;
(function (pfb) {
    var Services;
    (function (Services) {
        var GACService = (function () {
            function GACService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            GACService.prototype.autocomplete = function (input) {
                var deferred = this.qService.defer();
                this.httpService.post(PFBConfig.apiEndpoint + 'maps/autocomplete', {
                    Input: input
                }).then(function (result) {
                    if (result.statusText == "OK") {
                        if (result.data["status"] == "OK") {
                            deferred.resolve(result.data["predictions"]);
                        }
                        else {
                            deferred.reject(result.data["status"]);
                        }
                    }
                    else {
                        deferred.reject(result.statusText);
                    }
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            ;
            GACService.prototype.details = function (id) {
                var deferred = this.qService.defer();
                this.httpService.post(PFBConfig.apiEndpoint + 'maps/details', {
                    PlaceId: id
                }).then(function (result) {
                    if (result.statusText == "OK") {
                        if (result.data["status"] == "OK") {
                            deferred.resolve(result.data["result"]);
                        }
                        else {
                            deferred.reject(result.data["status"]);
                        }
                    }
                    else {
                        deferred.reject(result.statusText);
                    }
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            GACService.$inject = ['$http', '$q'];
            return GACService;
        })();
        angular.module('pfb').service('gacService', GACService);
    })(Services = pfb.Services || (pfb.Services = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=GACService.js.map