'use strict';
app.factory('mailerFactory', ['$http', 'apiEndPoint', 'clientId', function ($http, apiEndPoint, clientId) {

    var mailerFactory = {};

    var _mail = function (data) {
        return $http.post(apiEndPoint + 'mailer', data);
    }

    mailerFactory.sendMail = _mail;

    return mailerFactory;
}])