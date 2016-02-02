module app.services {

    export interface IPageLayoutService {
        getBySiteId(siteId: string): ng.IPromise<app.domain.IPageLayout[]>;
        getData(pageLayoutId: string): ng.IPromise<app.domain.IPageLayout>;
        update(data: app.domain.IPageLayout): ng.IPromise<any>;
        remove(id: string): ng.IPromise<any>;
    }

    class PageLayoutService {

        static $inject = ['$http', '$q'];
        constructor(private httpService: ng.IHttpService, private qService: ng.IQService) {
        }

        getBySiteId(siteId: string): ng.IPromise<app.domain.IPageLayout[]> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/pagelayout?siteId=' + siteId).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        getData(pageLayoutId: string): ng.IPromise<app.domain.IPageLayout> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/pagelayout/' + pageLayoutId).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        update(data: app.domain.IPageLayout): ng.IPromise<any> {
            return this.httpService.post('/api/pagelayout', data);
        }

        remove(id: string): ng.IPromise<any> {
            return this.httpService.delete('/api/pagelayout/' + id);
        }
    }

    angular
        .module('app')
        .service('PageLayoutService', PageLayoutService);
}