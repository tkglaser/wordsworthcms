(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserFactory', UserFactory);

    UserFactory.$inject = ['$http', '$rootScope'];

    function UserFactory($http, $rootScope) {
        var service = {
            getUser: getUser,
            getAll: getAll,
            create: create,
            update: update,
            remove: remove
        };

        return service;

        function getUser() {
            if (typeof $rootScope.appUser === 'undefined'){
                return $http.get('/api/user')
                    .success(function (result) {
                        $rootScope.appUser = result;
                        return result;
                    });
            } else {
                return $rootScope.appUser;
            }
        }

        function getAll() {
            return $http.get('/api/user/all');
        }

        function create(data) {
            return $http.post('/api/user/create', data);
        }

        function update(data) {
            return $http.post('/api/user', data);
        }

        function remove(id) {
            return $http.delete('/api/user/' + id);
        }
    }
})();