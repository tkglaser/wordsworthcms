(function () {
    'use strict';

    angular
        .module('app')
        .factory('LayoutsFactory', LayoutsFactory);

    LayoutsFactory.$inject = ['$http'];

    function LayoutsFactory($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() {
            return $http.get('/api/layouts');
        }
    }
})();