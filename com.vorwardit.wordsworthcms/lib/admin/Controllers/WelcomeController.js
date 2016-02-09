var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var WelcomeController = (function () {
            function WelcomeController() {
            }
            return WelcomeController;
        })();
        angular
            .module('app')
            .controller('WelcomeController', WelcomeController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=WelcomeController.js.map