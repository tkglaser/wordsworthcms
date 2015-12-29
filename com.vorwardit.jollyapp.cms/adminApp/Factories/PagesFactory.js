(function () {
    'use strict';

    angular
        .module('app')
        .factory('PagesFactory', PagesFactory);

    PagesFactory.$inject = ['$http'];

    function PagesFactory($http) {
        var service = {
            getData: getData,
            getVersions: getVersions,
            update: update,
            updateVersion: updateVersion,
            remove: remove,
        };

        return service;

        function getData(noBody) {
            if (noBody == true) {
                return $http.get('/api/pages');
            }
            else {
                return $http.get('/api/pages');
            }
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

        function remove(id) {
            return $http.delete('/api/pages/' + id);
        }
    }
})();