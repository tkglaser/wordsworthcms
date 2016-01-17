(function () {
    'use strict';

    angular
        .module('app')
        .factory('PagesFactory', PagesFactory);

    PagesFactory.$inject = ['$http'];

    function PagesFactory($http) {
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
            return $http.get('/api/pages?siteId=' + siteId);
        }

        function getData(pageId) {
            return $http.get('/api/pages/' + pageId);
        }

        function getVersions(id) {
            return $http.get('/api/pageversions?pageId=' + id);
        }

        function update(data) {
            return $http.post('/api/pages', data);
        }

        function updateVersion(data) {
            return $http.post('/api/pageversions', data);
        }

        function publish(versionId) {
            return $http.post('/api/pageversions/publish?versionId=' + versionId);
        }

        function remove(id) {
            return $http.delete('/api/pages/' + id);
        }
    }
})();