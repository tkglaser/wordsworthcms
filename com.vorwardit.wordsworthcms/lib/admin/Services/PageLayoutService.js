var app;
(function (app) {
    var services;
    (function (services) {
        var PageLayoutService = (function () {
            function PageLayoutService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            PageLayoutService.prototype.getBySiteId = function (siteId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/pagelayout?siteId=' + siteId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            PageLayoutService.prototype.getData = function (pageLayoutId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/pagelayout/' + pageLayoutId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            PageLayoutService.prototype.update = function (data) {
                return this.httpService.post('/api/pagelayout', data);
            };
            PageLayoutService.prototype.remove = function (id) {
                return this.httpService.delete('/api/pagelayout/' + id);
            };
            PageLayoutService.$inject = ['$http', '$q'];
            return PageLayoutService;
        })();
        angular
            .module('app')
            .service('PageLayoutService', PageLayoutService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
