var app;
(function (app) {
    var services;
    (function (services) {
        var LayoutService = (function () {
            function LayoutService($http, $q) {
                this.httpService = $http;
                this.qService = $q;
            }
            LayoutService.prototype.getBySiteId = function (siteId) {
                var defer = this.qService.defer();
                this.httpService.get('/api/layout?siteId=' + siteId).then(function (result) {
                    defer.resolve(result.data);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            };
            LayoutService.prototype.getData = function (layoutId) {
                var defer = this.qService.defer();
                this.httpService.get('/api/layout/' + layoutId).then(function (result) {
                    defer.resolve(result.data);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            };
            LayoutService.prototype.update = function (data) {
                return this.httpService.post('/api/layout', data);
            };
            LayoutService.prototype.remove = function (id) {
                return this.httpService.delete('/api/layout/' + id);
            };
            LayoutService.$inject = ['$http', '$q'];
            return LayoutService;
        })();
        angular
            .module('app')
            .service('LayoutService', LayoutService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
//# sourceMappingURL=LayoutService.js.map