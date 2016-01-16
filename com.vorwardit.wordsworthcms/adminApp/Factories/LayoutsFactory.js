(function () {
    'use strict';

    angular
        .module('app')
        .factory('LayoutsFactory', LayoutsFactory);

    LayoutsFactory.$inject = ['$http'];

    function LayoutsFactory($http) {
        var service = {
            getBySiteId: getBySiteId,
            getData: getData,
            update: update,
            remove: remove
        };

        return service;

        function getBySiteId(siteId) {
            return $http.get('/api/layouts?siteId=' + siteId);
        }

        function getData(layoutId) {
            return $http.get('/api/layouts/' + layoutId);
        }

        function update(data) {
            return $http.post('/api/layouts', data);
        }

        function remove(id) {
            return $http.delete('/api/layouts/' + id);
        }
    }
})();