var app;
(function (app) {
    var services;
    (function (services) {
        var DataService = (function () {
            function DataService($http, $q) {
                this.httpService = $http;
                this.qService = $q;
            }
            DataService.prototype.get = function (resource) {
                var self = this;
                var deferred = self.qService.defer();
                self.httpService.get(resource).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            DataService.$inject = ['$http', '$q'];
            return DataService;
        })();
        services.DataService = DataService;
        angular.module('app')
            .service('dataService', DataService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
