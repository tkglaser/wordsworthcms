var pfb;
(function (pfb) {
    var Controllers;
    (function (Controllers) {
        var OrderController = (function () {
            function OrderController(locationService, routeParamsService, sceService, requestService, request, offer) {
                this.locationService = locationService;
                this.routeParamsService = routeParamsService;
                this.sceService = sceService;
                this.requestService = requestService;
                this.form = {};
                this.paymode = 'later';
                this.submitted = false;
                this.offer = offer.data;
                this.request = request.data;
                this.name = this.request.name;
                this.email = this.request.email;
                this.organisation = this.request.organisation;
                this.street = this.request.address;
                this.town = this.request.town;
                this.postcode = this.request.postcode;
                this.requestId = this.routeParamsService["requestId"];
                this.offerId = this.routeParamsService["offerId"];
                // TODO
                //$scope.$on('$viewContentLoaded', function (event) {
                //    analytics.pageView('/app/order');
                //});
                this.offer.safeProductDescription = this.sceService.trustAsHtml(this.offer.productDescription);
                $("body,html").scrollTop(0);
            }
            OrderController.prototype.nameValidClass = function () {
                if (!this.form.name.$dirty && !this.submitted) {
                    return '';
                }
                if (this.form.name.$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            OrderController.prototype.emailValidClass = function () {
                if (!this.form.email.$dirty && !this.submitted) {
                    return '';
                }
                if (this.form.email.$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            OrderController.prototype.streetValidClass = function () {
                if (!this.form.street.$dirty && !this.submitted) {
                    return '';
                }
                if (this.form.street.$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            OrderController.prototype.townValidClass = function () {
                if (!this.form.town.$dirty && !this.submitted) {
                    return '';
                }
                if (this.form.town.$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            OrderController.prototype.postcodeValidClass = function () {
                if (!this.form.postcode.$dirty && !this.submitted) {
                    return '';
                }
                if (this.form.postcode.$valid) {
                    return 'has-success';
                }
                else {
                    return 'has-error';
                }
            };
            OrderController.prototype.submit = function () {
                var _this = this;
                this.submitted = true;
                if (this.form.$valid) {
                    var newData = {
                        requestId: this.requestId,
                        name: this.name,
                        email: this.email,
                        organisation: this.organisation,
                        address: this.street,
                        town: this.town,
                        postcode: this.postcode,
                    };
                    this.requestService.update(newData).then(function () {
                        _this.locationService.path('/orderconfirm/' + _this.requestId + '/' + _this.offerId + '/' + _this.paymode);
                    }, function () {
                        // TODO
                    });
                }
            };
            ;
            OrderController.$inject = ['$location', '$routeParams', '$sce', 'RequestService', 'request', 'offer'];
            return OrderController;
        })();
        angular.module('pfb').controller('OrderController', OrderController);
    })(Controllers = pfb.Controllers || (pfb.Controllers = {}));
})(pfb || (pfb = {}));
