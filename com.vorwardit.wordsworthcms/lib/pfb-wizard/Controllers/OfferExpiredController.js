var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var OfferExpiredController = (function () {
            function OfferExpiredController(locationService, routeParamsService, request) {
                this.locationService = locationService;
                this.routeParamsService = routeParamsService;
                this.success = false;
                this.request = request.data;
                this.requestId = this.routeParamsService["requestId"];
                this.locationService.search('r', null);
                this.locationService.search('s', null);
                // TODO: analytics
                $("body,html").scrollTop(0);
            }
            OfferExpiredController.$inject = ['$location', '$routeParams', 'request'];
            return OfferExpiredController;
        })();
        angular.module('pfb').controller('OfferExpiredController', OfferExpiredController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=OfferExpiredController.js.map