module app.services {
    interface IDataService {
        get(resource: string): ng.IPromise<app.domain.EntityBase[]>;
    }

    export class DataService implements IDataService {
        private httpService: ng.IHttpService;
        private qService: ng.IQService;

        static $inject = ['$http', '$q'];

        constructor($http: ng.IHttpService, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
        }

        get(resource: string): ng.IPromise<app.domain.EntityBase[]> {
            var self = this;

            var deferred = self.qService.defer();

            self.httpService.get(resource).then(function (result: any) {
                deferred.resolve(result.data);
            }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }

    angular.module('app')
        .service('dataService', DataService);
}