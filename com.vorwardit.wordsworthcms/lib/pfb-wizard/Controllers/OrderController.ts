module pfb.Controllers {
    class OrderController {

        request: Models.IRequest;
        offer: Models.IOffer;
        requestId: string;
        offerId: number;

        form: ng.IFormController;
        submitted: boolean = false;
        
        name: string;
        email: string;
        organisation: string;
        street: string;
        town: string;
        postcode: string;
        paymode: string = 'later';

        static $inject = ['$location', '$routeParams', '$sce', 'RequestService', 'request', 'offer'];
        constructor(
            private locationService: ng.ILocationService,
            private routeParamsService: ng.route.IRouteParamsService,
            private sceService: ng.ISCEService,
            private requestService: Services.IRequestService,
            request: any,
            offer: any
        ) {
            this.offer = offer;
            this.request = request;

            this.name = this.request.name;
            this.email = this.request.email;
            this.organisation = this.request.organisation;
            this.street = this.request.address;
            this.town = this.request.town;
            this.postcode = this.request.postcode;
            this.paymode = 'later';

            this.requestId = this.routeParamsService["requestId"];
            this.offerId = this.routeParamsService["offerId"];

            // TODO
            //$scope.$on('$viewContentLoaded', function (event) {
            //    analytics.pageView('/app/order');
            //});

            this.offer.safeProductDescription = this.sceService.trustAsHtml(this.offer.productDescription);

            $("body,html").scrollTop(0);
        }

        submit(): void {
            this.submitted = true;
            if (this.form.$valid) {
                var newData: Models.IRequest = {
                    requestId: this.requestId,
                    name: this.name,
                    email: this.email,
                    organisation: this.organisation,
                    address: this.street,
                    town: this.town,
                    postcode: this.postcode
                }
                this.requestService.update(newData).then(
                    () => {
                        this.locationService.path('/orderconfirm/' + this.requestId + '/' + this.offerId + '/' + this.form["paymode"].$modelValue)
                    },
                    () => {
                        // TODO
                    });
            }
        };
    }
    angular.module('pfb').controller('OrderController', OrderController);
}