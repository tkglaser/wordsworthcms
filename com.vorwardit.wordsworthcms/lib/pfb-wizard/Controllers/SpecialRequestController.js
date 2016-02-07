var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var SpecialRequestController = (function () {
            function SpecialRequestController(routeParamsService, requestService, request) {
                this.routeParamsService = routeParamsService;
                this.requestService = requestService;
                this.success = false;
                this.request = request.data;
                this.requestId = this.routeParamsService["requestId"];
                // TODO: Analytics
                //$scope.$on('$viewContentLoaded', function (event) {
                //    analytics.pageView('/app/specialrequest');
                //});
                $("body,html").scrollTop(0);
            }
            SpecialRequestController.prototype.submit = function () {
                var _this = this;
                $("body,html").scrollTop(0);
                this.requestService.update({
                    requestId: this.requestId,
                    hasSpecialRequests: true,
                    specialRequests: this.SpecialRequests
                }).then(function () {
                    _this.success = true;
                }, function () {
                    // TODO
                });
            };
            ;
            SpecialRequestController.$inject = ['$routeParams', 'RequestService', 'request'];
            return SpecialRequestController;
        })();
        angular.module('pfb').controller('SpecialRequestController', SpecialRequestController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=SpecialRequestController.js.map