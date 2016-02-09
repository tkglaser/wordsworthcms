var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var CannotQuoteController = (function () {
            function CannotQuoteController(routeParamsService, requestService, request) {
                this.routeParamsService = routeParamsService;
                this.requestService = requestService;
                this.success = false;
                this.request = request.data;
                this.requestId = this.routeParamsService["requestId"];
                // TODO: Analytics
                $("body,html").scrollTop(0);
            }
            ;
            CannotQuoteController.prototype.submit = function () {
                var _this = this;
                $("body,html").scrollTop(0);
                this.requestService.update({
                    requestId: this.requestId,
                    name: this.Name,
                    email: this.EMail
                }).then(function () {
                    _this.success = true;
                }, function () { });
            };
            ;
            CannotQuoteController.$inject = ['$routeParams', 'RequestService', 'request'];
            return CannotQuoteController;
        })();
        angular.module('pfb').controller('CannotQuoteController', CannotQuoteController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
//# sourceMappingURL=CannotQuoteController.js.map