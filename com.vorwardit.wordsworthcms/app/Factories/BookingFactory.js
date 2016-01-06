'use strict';
app.factory('bookingFactory', ['$http', 'apiEndPoint', 'clientId', function ($http, apiEndPoint, clientId) {

    var bookingFactory = {};

    var _book = function (data) {
        return $http.post(apiEndPoint + 'booking', data);
    }

    var _payment = function (data) {
        return $http.post(apiEndPoint + 'paymentresult', data);
    }

    bookingFactory.book = _book;
    bookingFactory.pay = _payment;

    return bookingFactory;
}])