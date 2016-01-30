(function () {
    'use strict';

    angular
        .module('app')
        .factory('SiteFactory', SiteFactory);

    SiteFactory.$inject = ['$http', '$rootScope'];

    function SiteFactory($http, $rootScope) {
        var service = {
            getData: getData,
            getSelectedSite: getSelectedSite,
            setSelectedSite: setSelectedSite,
            update: update,
            remove: remove,
        };

        return service;

        function getData() {
            return $http.get('/api/site');
        }

        function getSelectedSite(sites) {
            if (typeof $rootScope.selectedSiteId === 'undefined') {
                $rootScope.selectedSiteId = adminAppGlobalSettings.defaultSiteId;
                if ($rootScope.selectedSiteId == '') {
                    $rootScope.selectedSiteId = sites[0].siteId;
                    return sites[0];
                }
            }
            for (var i = 0; i < sites.length; ++i) {
                var site = sites[i];
                if ($rootScope.selectedSiteId == site.siteId) {
                    return site;
                };
            }
        }

        function setSelectedSite(site) {
            $rootScope.selectedSiteId = site.siteId;
        }

        function update(data) {
            return $http.post('/api/site', data);
        }

        function remove(id) {
            return $http.delete('/api/site/' + id);
        }
    }
})();