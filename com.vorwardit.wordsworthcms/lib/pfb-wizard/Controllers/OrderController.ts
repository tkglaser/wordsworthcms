module pfb.Controllers {
    class OrderController {

        request: Models.IRequest;
        offer: Models.IOffer;
        requestId: string;
        offerId: number;
        name: string;
        email: string;
        organisation: string;
        street: string;
        town: string;
        postcode: string;

        form: any = {};
        paymode: string = 'later';
        submitted: boolean = false;

        static $inject = ['$location', '$routeParams', '$sce', 'RequestService', 'request', 'offer'];
        constructor(
            private locationService: ng.ILocationService,
            private routeParamsService: ng.route.IRouteParamsService,
            private sceService: ng.ISCEService,
            private requestService: Services.IRequestService,
            request: any,
            offer: any
        ) {
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

        nameValidClass(): string {
            if (!this.form.name.$dirty && !this.submitted) {
                return '';
            }
            if (this.form.name.$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        emailValidClass(): string {
            if (!this.form.email.$dirty && !this.submitted) {
                return '';
            }
            if (this.form.email.$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        streetValidClass(): string {
            if (!this.form.street.$dirty && !this.submitted) {
                return '';
            }
            if (this.form.street.$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        townValidClass(): string {
            if (!this.form.town.$dirty && !this.submitted) {
                return '';
            }
            if (this.form.town.$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
        }

        postcodeValidClass(): string {
            if (!this.form.postcode.$dirty && !this.submitted) {
                return '';
            }
            if (this.form.postcode.$valid) {
                return 'has-success';
            } else {
                return 'has-error';
            }
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
                    postcode: this.postcode,
                }
                this.requestService.update(newData).then(
                    () => {
                        this.locationService.path('/orderconfirm/' + this.requestId + '/' + this.offerId + '/' + this.paymode)
                    },
                    () => {
                        // TODO
                    });
            }
        };
    }
    angular.module('pfb').controller('OrderController', OrderController);
}