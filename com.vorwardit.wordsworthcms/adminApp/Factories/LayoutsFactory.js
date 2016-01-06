(function () {
    'use strict';

    angular
        .module('app')
        .factory('LayoutsFactory', LayoutsFactory);

    LayoutsFactory.$inject = ['$http'];

    function LayoutsFactory($http) {
        var service = {
            getData: getData,
            update: update,
            remove: remove
        };

        return service;

        function getData(noBody) {
            if (noBody == true) {
                return $http.get('/api/layouts?noBody=true');
            }
            else {
                return $http.get('/api/layouts');
            }
        }

        function update(data) {
            return $http.post('/api/layouts', data);
        }

        function remove(id) {
            return $http.delete('/api/layouts/' + id);
        }
    }
})();