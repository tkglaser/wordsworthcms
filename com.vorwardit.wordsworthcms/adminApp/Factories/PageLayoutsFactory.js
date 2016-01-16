(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageLayoutsFactory', PageLayoutsFactory);

    PageLayoutsFactory.$inject = ['$http'];

    function PageLayoutsFactory($http) {
        var service = {
            getBySiteId: getBySiteId,
            getData: getData,
            update: update,
            remove: remove,
        };

        return service;

        function getBySiteId(siteId) {
            return $http.get('/api/pagelayouts?siteId=' + siteId);
        }

        function getData(pageLayoutId) {
            return $http.get('/api/pagelayouts/' + pageLayoutId);
        }

        function update(data) {
            return $http.post('/api/pagelayouts', data);
        }

        function remove(id) {
            return $http.delete('/api/pagelayouts/' + id);
        }
    }
})();