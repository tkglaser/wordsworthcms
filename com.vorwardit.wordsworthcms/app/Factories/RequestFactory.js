'use strict';
app.factory('requestFactory', ['$http', '$q', 'apiEndPoint', 'clientId', function ($http, $q, apiEndPoint, clientId) {

    var requestFactory = {};

    var _createRequest = function () {
        return $http.post(apiEndPoint + 'request/new', {
            ClientId: clientId
        });
    };

    var _updateRequest = function (data) {
        return $http.post(apiEndPoint + 'request', data);
    }

    var _getRequest = function (id) {
        return $http.post(apiEndPoint + 'request', {
            RequestId: id
        });
    }

    var _getOffers = function (id) {
        return $q(function (resolve, reject) {
            $http.post(apiEndPoint + 'offer?RequestId=' + id)
            .then(function (response) {
                var offers = response.data;
                var desc = '<b>Kein Angebot m&ouml;glich.</b>' +
                    '<div>In dieser Kategorie k&ouml;nnen wir Ihnen momentan leider kein Sofortangebot unterbreiten. Bitte kontaktieren Sie uns f&uuml;r ein individuelles Angebot.</div>';

                if (offers.length < 1) {
                    offers.push({
                        productName: 'Standard',
                        productDescription: desc,
                        noOffer: true
                    })
                }

                if (offers.length < 2) {
                    offers.push({
                        productName: 'Komfort',
                        productDescription: desc,
                        noOffer: true
                    })
                }

                if (offers.length < 3) {
                    offers.push({
                        productName: 'Luxus',
                        productDescription: desc,
                        noOffer: true
                    })
                };

                resolve(offers);
            })
        });
    }

    var _getOffer = function (id, oid) {
        return $http.post(apiEndPoint + 'offer?RequestId=' + id + '&OfferId=' + oid);
    }

    requestFactory.create = _createRequest;
    requestFactory.update = _updateRequest;
    requestFactory.get = _getRequest;
    requestFactory.offers = _getOffers;
    requestFactory.offer = _getOffer;

    return requestFactory;
}])