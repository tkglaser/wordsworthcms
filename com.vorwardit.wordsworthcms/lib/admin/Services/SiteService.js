var app;
(function (app) {
    var services;
    (function (services) {
        var SiteService = (function () {
            function SiteService($http, $rootScope) {
                this.httpService = $http;
                this.rootScopeService = $rootScope;
            }
            SiteService.prototype.getData = function () {
                return this.httpService.get('/api/site');
            };
            SiteService.prototype.getSelectedSite = function (sites) {
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
                    }
                    ;
                }
            };
            SiteService.prototype.setSelectedSite = function (site) {
                this.rootScopeService["selectedSiteId"] = site.siteId;
            };
            SiteService.prototype.update = function (data) {
                return this.httpService.post('/api/site', data);
            };
            SiteService.prototype.remove = function (id) {
                return this.httpService.delete('/api/site/' + id);
            };
            SiteService.$inject = ['$http', '$rootScope'];
            return SiteService;
        })();
        services.SiteService = SiteService;
        angular.module('app')
            .service('siteService', SiteService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
