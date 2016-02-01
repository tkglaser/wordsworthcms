var app;
(function (app) {
    var services;
    (function (services) {
        var UserService = (function () {
            function UserService($http, $rootScope, $q) {
                this.httpService = $http;
                this.rootScopeService = $rootScope;
                this.qService = $q;
            }
            UserService.prototype.getUser = function () {
                var self = this;
                var deferred = this.qService.defer();
                if (typeof this.rootScopeService["appUser"] === 'undefined') {
                    this.httpService.get('/api/user').then(function (result) {
                        self.rootScopeService["appUser"] = result.data;
                        deferred.resolve(result.data);
                    }, function (error) {
                        deferred.reject(error);
                    });
                }
                else {
                    deferred.resolve(self.rootScopeService["appUser"]);
                }
                return deferred.promise;
            };
            UserService.prototype.getAll = function () {
                var self = this;
                var deferred = this.qService.defer();
                this.httpService.get('/api/user/all').then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            UserService.prototype.create = function (data) {
                return this.httpService.post('/api/user/create', data);
            };
            UserService.prototype.update = function (data) {
                return this.httpService.post('/api/user', data);
            };
            UserService.prototype.remove = function (id) {
                return this.httpService.delete('/api/user/' + id);
            };
            UserService.$inject = ['$http', '$rootScope', '$q'];
            return UserService;
        })();
        angular
            .module('app')
            .factory('UserService', UserService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
//# sourceMappingURL=UserService.js.map