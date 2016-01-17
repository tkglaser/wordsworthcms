(function () {
    'use strict';

    angular
        .module('app')
        .factory('AssetFactory', AssetFactory);

    AssetFactory.$inject = ['$http', '$q'];

    function AssetFactory($http, $q) {
        var service = {
            getData: getData,
            upload: upload,
            remove: remove
        };

        return service;

        function getData(siteId) {
            return $http.get('/api/asset?siteId=' + siteId);
        }

        function getModelAsFormData(data) {
            var dataAsFormData = new FormData();
            angular.forEach(data, function (value, key) {
                dataAsFormData.append(key, value);
            });
            return dataAsFormData;
        };

        function upload(data) {
            var deferred = $q.defer();
            $http({
                url: '/AssetUpload/SaveAsset',
                method: 'POST',
                data: getModelAsFormData(data),
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (result, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        }

        function remove(siteId, name) {
            return $http.delete('/api/asset?name=' + name + "&siteId=" + siteId);
        }
    }
})();