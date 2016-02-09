var pfb;
(function (pfb) {
    var Services;
    (function (Services) {
        var MailerService = (function () {
            function MailerService(httpService, qService) {
                this.httpService = httpService;
                this.qService = qService;
            }
            MailerService.prototype.sendMail = function (data) {
                return this.httpService.post(PFBConfig.apiEndpoint + 'mailer', data);
            };
            MailerService.$inject = ['$http', '$q'];
            return MailerService;
        })();
        angular.module('pfb').service('MailerService', MailerService);
    })(Services = pfb.Services || (pfb.Services = {}));
})(pfb || (pfb = {}));
