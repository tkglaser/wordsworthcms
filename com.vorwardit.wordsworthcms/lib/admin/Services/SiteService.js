var app;
(function (app) {
    var services;
    (function (services) {
        var SiteService = (function () {
            function SiteService($http, $rootScope, $q) {
                this.httpService = $http;
                this.rootScopeService = $rootScope;
                this.qService = $q;
            }
            SiteService.prototype.getData = function () {
                var self = this;
                var defer = self.qService.defer();
                this.httpService.get('/api/site').then(function (result) {
                    defer.resolve(result.data);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
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
            SiteService.$inject = ['$http', '$rootScope', '$q'];
            return SiteService;
        })();
        services.SiteService = SiteService;
        angular.module('app')
            .service('SiteService', SiteService);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
//# sourceMappingURL=SiteService.js.map