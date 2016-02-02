module app.services {

    export interface ILayoutService {
        getBySiteId(siteId: string): ng.IPromise<app.domain.ILayout[]>;
        getData(layoutId: string): ng.IPromise<app.domain.ILayout>;
        update(data: app.domain.ILayout): ng.IPromise<any>;
        remove(id: string): ng.IPromise<any>;
    }

    class LayoutService implements ILayoutService {
        private httpService: ng.IHttpService;
        private qService: ng.IQService;

        static $inject = ['$http', '$q'];
        constructor($http: ng.IHttpService, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
        }

        getBySiteId(siteId: string): ng.IPromise<app.domain.ILayout[]> {
            var defer = this.qService.defer();
            this.httpService.get('/api/layout?siteId=' + siteId).then(
                (result) => {
                    defer.resolve(result.data);
                },
                (error) => {
                    defer.reject(error);
                });
            return defer.promise;
        }
        
        getData(layoutId: string): ng.IPromise<app.domain.ILayout> {
            var defer = this.qService.defer();
            this.httpService.get('/api/layout/' + layoutId).then(
                (result) => {
                    defer.resolve(result.data);
                },
                (error) => {
                    defer.reject(error);
                });
            return defer.promise;
        }

        update(data: app.domain.ILayout): ng.IPromise<any> {
            return this.httpService.post('/api/layout', data);
        }

        remove(id: string): ng.IPromise<any> {
            return this.httpService.delete('/api/layout/' + id);
        }
    }

    angular
        .module('app')
        .service('LayoutService', LayoutService);
}