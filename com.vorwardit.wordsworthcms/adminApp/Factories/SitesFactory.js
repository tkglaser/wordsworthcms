(function () {
    'use strict';

    angular
        .module('app')
        .factory('SitesFactory', SitesFactory);

    SitesFactory.$inject = ['$http', '$rootScope'];

    function SitesFactory($http, $rootScope) {
        var service = {
            getData: getData,
            getSelectedSite: getSelectedSite,
            setSelectedSite: setSelectedSite,
            update: update,
            remove: remove,
        };

        return service;

        function getData() {
            return $http.get('/api/sites');
        }

        function getSelectedSite(sites) {
            if (typeof $rootScope.selectedSiteId === 'undefined') {
                $rootScope.selectedSiteId = adminAppGlobalSettings.defaultSiteId;
                if ($rootScope.selectedSiteId == '') {
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
            return $http.post('/api/sites', data);
        }

        function remove(id) {
            return $http.delete('/api/sites/' + id);
        }
    }
})();