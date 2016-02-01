﻿declare var adminAppGlobalSettings: any;

module app.services {
    export class SiteService {
        private httpService: ng.IHttpService;
        private rootScopeService: ng.IRootScopeService;

        static $inject = ['$http', '$rootScope'];

        constructor($http: ng.IHttpService, $rootScope: ng.IRootScopeService) {
            this.httpService = $http;
            this.rootScopeService = $rootScope;
        }

        getData(): ng.IPromise<app.domain.ISite[]> {
            return this.httpService.get('/api/site');
        }
        
        getSelectedSite(sites: app.domain.ISite[]): app.domain.ISite {
            if (typeof this.rootScopeService["selectedSiteId"] === 'undefined') {
                this.rootScopeService["selectedSiteId"] = adminAppGlobalSettings.defaultSiteId;
                if (this.rootScopeService["selectedSiteId"] == '') {
                    this.rootScopeService["selectedSiteId"] = sites[0].siteId;
                    return sites[0];
                }
            }
            for (var i = 0; i < sites.length; ++i) {
                var site = sites[i];
                if (this.rootScopeService["selectedSiteId"] == site.siteId) {
                    return site;
                };
            }
        }

        setSelectedSite(site: app.domain.ISite) {
            this.rootScopeService["selectedSiteId"] = site.siteId;
        }

        update(data: app.domain.ISite): ng.IPromise<any> {
            return this.httpService.post('/api/site', data);
        }

        remove(id: string): ng.IPromise<any> {
            return this.httpService.delete('/api/site/' + id);
        }
    }

    angular.module('app')
        .service('siteService', SiteService);
}