(function () {
    'use strict';

    angular
        .module('app')
        .factory('PermissionFactory', PermissionFactory);

    PermissionFactory.$inject = ['$http', '$rootScope'];

    function PermissionFactory($http, $rootScope) {
        var service = {
            getPermissions: getPermissions
        };

        return service;

        function getPermissions() { 
            if (typeof $rootScope.permissions === 'undefined'){
                return $http.get('/api/permission')
                    .then(function (result) {
                        $rootScope.permissions = result;
                        return result;
                    });
            } else {
                return $rootScope.permissions;
            }
        }
    }
})();