(function () {
    'use strict';

    angular
        .module('app')
        .factory('SitesFactory', SiteFactory);

    SiteFactory.$inject = ['$http'];

    function SiteFactory($http) {
        var service = {
            getData: getData,
            update: update,
            remove: remove,
        };

        return service;

        function getData() {
            return $http.get('/api/sites');
        }

        function update(data) {
            return $http.post('/api/sites', data);
        }

        function remove(id) {
            return $http.delete('/api/sites/' + id);
        }
    }
})();