(function () {
    'use strict';

    angular
        .module('app')
        .factory('PagesFactory', PagesFactory);

    PagesFactory.$inject = ['$http'];

    function PagesFactory($http) {
        var service = {
            getData: getData,
            update: update,
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

        function update(data) {
            return $http.post('/api/pages', data);
        }

        function remove(id) {
            return $http.delete('/api/pages/' + id);
        }
    }
})();