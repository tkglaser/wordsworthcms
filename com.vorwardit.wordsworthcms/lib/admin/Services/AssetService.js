var app;
(function (app) {
    var services;
    (function (services) {
        var AssetService = (function () {
            function AssetService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            AssetService.prototype.getData = function (siteId) {
                var deferred = this.qService.defer();
                this.httpService.get('/api/asset?siteId=' + siteId).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            AssetService.prototype.getModelAsFormData = function (data) {
                var dataAsFormData = new FormData();
                angular.forEach(data, function (value, key) {
                    dataAsFormData.append(key, value);
                });
                return dataAsFormData;
            };
            ;
            AssetService.prototype.upload = function (data) {
                var deferred = this.qService.defer();
                this.httpService({
                    url: '/AssetUpload/SaveAsset',
                    method: 'POST',
                    data: this.getModelAsFormData(data),
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (result) {
                    deferred.resolve(result);
                }).error(function (result, status) {
                    deferred.reject(status);
                });
                return deferred.promise;
            };
            AssetService.prototype.remove = function (siteId, name) {
                return this.httpService.delete('/api/asset?name=' + name + "&siteId=" + siteId);
            };
            AssetService.$inject = ['$http', '$q'];
            return AssetService;
        })();
        angular
            .module('app')
            .service('AssetService', AssetService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
