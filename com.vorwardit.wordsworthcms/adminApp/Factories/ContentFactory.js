(function () {
    'use strict';

    angular
        .module('app')
        .factory('ContentFactory', ContentFactory);

    ContentFactory.$inject = ['$http'];

    function ContentFactory($http) {
        var service = {
            getData: getData,
            update: update,
            remove: remove
        };

        return service;

        function getData(siteId, noBody) {
            if (noBody == true) {
                return $http.get('/api/content?noBody=true&siteId=' + siteId);
            }
            else {
                return $http.get('/api/content?siteId=' + siteId);
            }
        }

        function update(data) {
            return $http.post('/api/content', data);
        }

        function remove(id) {
            return $http.delete('/api/content/' + id);
        }
    }
})();