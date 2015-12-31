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

        function getData(noBody) {
            if (noBody == true) {
                return $http.get('/api/content?noBody=true');
            }
            else {
                return $http.get('/api/content');
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