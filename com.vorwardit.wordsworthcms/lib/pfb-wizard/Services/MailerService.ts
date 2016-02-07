declare var PFBConfig: pfb.Models.IPFBConfig;

module pfb.Services {

    export interface IMailerService {
        sendMail(data: Models.IMail): ng.IPromise<any>;
    }


    class MailerService {
        static $inject = ['$http', '$q'];
        constructor(
            private httpService: ng.IHttpService,
            private qService: ng.IQService
        ) {
        }

        sendMail(data: Models.IMail): ng.IPromise<any> {
            return this.httpService.post(PFBConfig.apiEndpoint + 'mailer', data);
        }
    }

    angular.module('pfb').service('MailerService', MailerService);
}