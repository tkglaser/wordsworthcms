module app.services {

    export interface IUserService {
        getUser(): ng.IPromise<app.domain.IUser>;
        getAll(): ng.IPromise<app.domain.IUser[]>;
        create(data: app.domain.IUser): ng.IPromise<any>;
        update(data: app.domain.IUser): ng.IPromise<any>;
        remove(id: string): ng.IPromise<any>;
    }

    class UserService implements IUserService {
        private httpService: ng.IHttpService;
        private rootScopeService: ng.IRootScopeService;
        private qService: ng.IQService;

        static $inject = ['$http', '$rootScope', '$q'];
        constructor($http: ng.IHttpService, $rootScope: ng.IRootScopeService, $q: ng.IQService) {
            this.httpService = $http;
            this.rootScopeService = $rootScope;
            this.qService = $q;
        }

        getUser(): ng.IPromise<app.domain.IUser> {
            var deferred = this.qService.defer();
            if (typeof this.rootScopeService["appUser"] === 'undefined') {
                this.httpService.get('/api/user').then(
                    (result) => {
                        this.rootScopeService["appUser"] = result.data;
                        deferred.resolve(result.data);
                    },
                    function (error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.resolve(this.rootScopeService["appUser"]);
            }
            return deferred.promise;
        }
        
        getAll(): ng.IPromise<app.domain.IUser[]> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/user/all').then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        create(data: app.domain.IUser): ng.IPromise<any> {
            return this.httpService.post('/api/user/create', data);
        }
        
        update(data: app.domain.IUser): ng.IPromise<any> {
            return this.httpService.post('/api/user', data);
        }
        
        remove(id: string): ng.IPromise<any> {
            return this.httpService.delete('/api/user/' + id);
        }
    }

    angular
        .module('app')
        .service('UserService', UserService);
}