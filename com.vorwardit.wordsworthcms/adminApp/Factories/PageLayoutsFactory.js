(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageLayoutsFactory', PageLayoutsFactory);

    PageLayoutsFactory.$inject = ['$http'];

    function PageLayoutsFactory($http) {
        var service = {
            getData: getData,
            update: update,
            remove: remove,
        };

        return service;

        function getData(siteId, noBody) {
            if (noBody == true) {
                return $http.get('/api/pagelayouts?noBody=true&siteId=' + siteId);
            }
            else {
                return $http.get('/api/pagelayouts?siteId=' + siteId);
            }
        }

        function update(data) {
            return $http.post('/api/pagelayouts', data);
        }

        function remove(id) {
            return $http.delete('/api/pagelayouts/' + id);
        }
    }
})();