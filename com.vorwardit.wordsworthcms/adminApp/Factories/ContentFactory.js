(function () {
    'use strict';

    angular
        .module('app')
        .factory('ContentFactory', ContentFactory);

    ContentFactory.$inject = ['$http'];

    function ContentFactory($http) {
        var service = {
            getBySiteId: getBySiteId,
            getData: getData,
            update: update,
            remove: remove
        };

        return service;

        function getBySiteId(siteId) {
            return $http.get('/api/content?siteId=' + siteId);
        }

        function getData(contentId) {
            return $http.get('/api/content/' + contentId);
        }

        function update(data) {
            return $http.post('/api/content', data);
        }

        function remove(id) {
            return $http.delete('/api/content/' + id);
        }
    }
})();