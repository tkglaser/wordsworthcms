module app.services {

    export interface IPageService {
        getBySiteId(siteId: string): ng.IPromise<app.domain.IPage[]>;
        getData(pageId: string): ng.IPromise<app.domain.IPage>;
        getVersions(id: string): ng.IPromise<app.domain.IPageVersion[]>;
        update(data: app.domain.IPage): ng.IPromise<any>;
        updateVersion(data: app.domain.IPageVersion): ng.IPromise<any>;
        publish(versionId: string): ng.IPromise<any>;
        createNewVersion(pageId: string): ng.IPromise<any>;
        remove(id: string): ng.IPromise<any>;
    }

    class PageService implements IPageService {

        static $inject = ['$http', '$q'];
        constructor(private httpService: ng.IHttpService, private qService: ng.IQService) {
        }

        getBySiteId(siteId: string): ng.IPromise<app.domain.IPage[]> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/page?siteId=' + siteId).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        getData(pageId: string): ng.IPromise<app.domain.IPage> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/page/' + pageId).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        getVersions(id: string): ng.IPromise<app.domain.IPageVersion[]> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/pageversion?pageId=' + id).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        update(data: app.domain.IPage): ng.IPromise<any> {
            return this.httpService.post('/api/page', data);
        }

        updateVersion(data: app.domain.IPageVersion): ng.IPromise<any> {
            return this.httpService.post('/api/pageversion', data);
        }

        publish(versionId: string): ng.IPromise<any> {
            return this.httpService.post('/api/pageversion/publish?versionId=' + versionId, null);
        }

        createNewVersion(pageId: string): ng.IPromise<any> {
            return this.httpService.post('/api/pageversion/newversion?pageId=' + pageId, null);
        }
        
        remove(id: string): ng.IPromise<any> {
            return this.httpService.delete('/api/page/' + id);
        }
    }

    angular
        .module('app')
        .service('PageService', PageService);
}