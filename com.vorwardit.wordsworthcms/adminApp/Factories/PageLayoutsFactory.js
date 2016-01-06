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

        function getData(noBody) {
            if (noBody == true) {
                return $http.get('/api/pagelayouts?noBody=true');
            }
            else {
                return $http.get('/api/pagelayouts');
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