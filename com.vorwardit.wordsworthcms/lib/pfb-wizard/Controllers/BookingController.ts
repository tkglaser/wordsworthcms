module pfb.Controllers {
    class BookingController {

        requestId: string;
        isMailFormShown: boolean = false;
        emailForSending: string;
        emailBeingSent: boolean = false;
        mailSendSuccess: boolean = false;

        static $inject = ['$routeParams', '$window', '$sce', '$timeout', 'MailerService', 'request'];
        constructor(
            private routeParamsService: ng.route.IRouteParamsService,
            private windowService: ng.IWindowService,
            private sceService: ng.ISCEService,
            private timeOutService: ng.ITimeoutService,
            private mailerService: Services.IMailerService,
            //private analyticsService: Services.IAnalyticsService,
            private request: Models.IRequest
        ) {
            this.requestId = routeParamsService["requestId"];
            this.emailForSending = request.email;

            // todo: analytics pageload

            this.request.safeProductDescription = this.sceService.trustAsHtml(this.request.productDescription);

            $("body,html").scrollTop(0);
        }

        print(): void {
            this.windowService.print();
        };

        showMailForm(): void {
            this.isMailFormShown = true;
        }

        sendMail(): void {
            this.emailBeingSent = true;
            this.mailerService.sendMail({
                Id: this.requestId,
                Type: 'orderconfirmation',
                Email: this.emailForSending
            }).then(
                (result) => {
                    this.emailBeingSent = false;
                    this.mailSendSuccess = true;
                    this.timeOutService(() => {
                        this.mailSendSuccess = false;
                        this.isMailFormShown = false;
                    }, 2000);
                },
                (error) => {
                    // TODO
                });
        }
    }
    angular.module('pfb').controller('BookingController', BookingController);
}