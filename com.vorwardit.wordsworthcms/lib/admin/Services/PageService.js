var app;
(function (app) {
    var services;
    (function (services) {
        var PageService = (function () {
            function PageService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            PageService.prototype.getBySiteId = function (siteId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/page?siteId=' + siteId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            PageService.prototype.getData = function (pageId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/page/' + pageId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            PageService.prototype.getVersions = function (id) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/pageversion?pageId=' + id).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            PageService.prototype.update = function (data) {
                return this.httpService.post('/api/page', data);
            };
            PageService.prototype.updateVersion = function (data) {
                return this.httpService.post('/api/pageversion', data);
            };
            PageService.prototype.publish = function (versionId) {
                return this.httpService.post('/api/pageversion/publish?versionId=' + versionId, null);
            };
            PageService.prototype.createNewVersion = function (pageId) {
                return this.httpService.post('/api/pageversion/newversion?pageId=' + pageId, null);
            };
            PageService.prototype.remove = function (id) {
                return this.httpService.delete('/api/page/' + id);
            };
            PageService.$inject = ['$http', '$q'];
            return PageService;
        })();
        angular
            .module('app')
            .service('PageService', PageService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
//# sourceMappingURL=PageService.js.map