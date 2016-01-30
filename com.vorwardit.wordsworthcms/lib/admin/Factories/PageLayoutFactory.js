(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageLayoutFactory', PageLayoutFactory);

    PageLayoutFactory.$inject = ['$http'];

    function PageLayoutFactory($http) {
        var service = {
            getBySiteId: getBySiteId,
            getData: getData,
            update: update,
            remove: remove,
        };

        return service;

        function getBySiteId(siteId) {
            return $http.get('/api/pagelayout?siteId=' + siteId);
        }

        function getData(pageLayoutId) {
            return $http.get('/api/pagelayout/' + pageLayoutId);
        }

        function update(data) {
            return $http.post('/api/pagelayout', data);
        }

        function remove(id) {
            return $http.delete('/api/pagelayout/' + id);
        }
    }
})();