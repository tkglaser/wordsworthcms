module app.services {

    export interface IAssetService {
        getData(siteId: string): ng.IPromise<app.domain.IAsset[]>;
        upload(data: app.domain.IAsset): ng.IPromise<any>;
        remove(siteId: string, name: string): ng.IPromise<any>;
    }

    export class AssetService {

        static $inject = ['$http', '$q'];
        constructor(private httpService: ng.IHttpService, private qService: ng.IQService) {
        }

        getData(siteId: string): ng.IPromise<app.domain.IAsset[]> {
            var deferred = this.qService.defer();
            this.httpService.get('/api/asset?siteId=' + siteId).then(
                (result) => {
                    deferred.resolve(result.data);
                }, (error) => {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        getModelAsFormData(data: app.domain.IAsset): FormData {
            var dataAsFormData = new FormData();
            angular.forEach(data, function (value, key) {
                dataAsFormData.append(key, value);
            });
            return dataAsFormData;
        };

        upload(data: app.domain.IAsset): ng.IPromise<any> {
            var deferred = this.qService.defer();
            this.httpService({
                url: '/AssetUpload/SaveAsset',
                method: 'POST',
                data: this.getModelAsFormData(data),
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(
                (result) => {
                    deferred.resolve(result);
                }
            ).error((result, status) => {
                    deferred.reject(status);
                }
            );
            return deferred.promise;
        }

        remove(siteId: string, name: string): ng.IPromise<any> {
            return this.httpService.delete('/api/asset?name=' + name + "&siteId=" + siteId);
        }
    }

    angular
        .module('app')
        .service('AssetService', AssetService);
}