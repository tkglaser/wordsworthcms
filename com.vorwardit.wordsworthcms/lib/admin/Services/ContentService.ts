module app.services {

    export interface IContentService {
        getBySiteId(siteId: string): ng.IPromise<app.domain.IContent[]>;
        getData(contentId: number): ng.IPromise<app.domain.IContent>;
        update(data: app.domain.IContent): ng.IPromise<any>;
        remove(id: number): ng.IPromise<any>;
    }

    class ContentService implements IContentService {

        static $inject = ['$http', '$q'];
        constructor(private httpService: ng.IHttpService, private qService: ng.IQService) {
        }

        getBySiteId(siteId: string): ng.IPromise<app.domain.IContent[]> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/content?siteId=' + siteId).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        getData(contentId: number): ng.IPromise<app.domain.IContent> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/content/' + contentId).then(
                (result) => {
                    deferred.resolve(result.data);
                },
                (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        update(data: app.domain.IContent): ng.IPromise<any> {
            return this.httpService.post('/api/content', data);
        }

        remove(id: number): ng.IPromise<any> {
            return this.httpService.delete('/api/content/' + id.toString());
        }
    }

    angular
        .module('app')
        .service('ContentService', ContentService);
}