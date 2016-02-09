var app;
(function (app) {
    var services;
    (function (services) {
        var ContentService = (function () {
            function ContentService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            ContentService.prototype.getBySiteId = function (siteId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/content?siteId=' + siteId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            ContentService.prototype.getData = function (contentId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/content/' + contentId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            ContentService.prototype.update = function (data) {
                return this.httpService.post('/api/content', data);
            };
            ContentService.prototype.remove = function (id) {
                return this.httpService.delete('/api/content/' + id.toString());
            };
            ContentService.$inject = ['$http', '$q'];
            return ContentService;
        })();
        angular
            .module('app')
            .service('ContentService', ContentService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
