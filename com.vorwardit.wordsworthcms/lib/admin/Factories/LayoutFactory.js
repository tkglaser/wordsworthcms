(function () {
    'use strict';

    angular
        .module('app')
        .factory('LayoutFactory', LayoutFactory);

    LayoutFactory.$inject = ['$http'];

    function LayoutFactory($http) {
        var service = {
            getBySiteId: getBySiteId,
            getData: getData,
            update: update,
            remove: remove
        };

        return service;

        function getBySiteId(siteId) {
            return $http.get('/api/layout?siteId=' + siteId);
        }

        function getData(layoutId) {
            return $http.get('/api/layout/' + layoutId);
        }

        function update(data) {
            return $http.post('/api/layout', data);
        }

        function remove(id) {
            return $http.delete('/api/layout/' + id);
        }
    }
})();