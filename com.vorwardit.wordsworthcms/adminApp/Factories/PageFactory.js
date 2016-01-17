(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageFactory', PageFactory);

    PageFactory.$inject = ['$http'];

    function PageFactory($http) {
        var service = {
            getBySiteId: getBySiteId,
            getData: getData,
            getVersions: getVersions,
            update: update,
            publish: publish,
            updateVersion: updateVersion,
            remove: remove,
        };

        return service;

        function getBySiteId(siteId) {
            return $http.get('/api/page?siteId=' + siteId);
        }

        function getData(pageId) {
            return $http.get('/api/page/' + pageId);
        }

        function getVersions(id) {
            return $http.get('/api/pageversion?pageId=' + id);
        }

        function update(data) {
            return $http.post('/api/page', data);
        }

        function updateVersion(data) {
            return $http.post('/api/pageversion', data);
        }

        function publish(versionId) {
            return $http.post('/api/pageversion/publish?versionId=' + versionId);
        }

        function remove(id) {
            return $http.delete('/api/page/' + id);
        }
    }
})();