'use strict';
app.factory('gacFactory', ['$http', 'apiEndPoint', function ($http, apiEndPoint) {

    var gacFactory = {};

    var _autocomplete = function (input) {
        return $http.post(apiEndPoint + 'maps/autocomplete', {
            Input: input
        });
    };

    var _details = function (id) {
        return $http.post(apiEndPoint + 'maps/details', {
            PlaceId: id
        });
    }

    gacFactory.autocomplete = _autocomplete;
    gacFactory.details = _details;

    return gacFactory;
}])