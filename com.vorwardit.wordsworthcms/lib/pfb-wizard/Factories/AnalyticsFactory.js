app.factory('analyticsFactory', ['$window', '$location', '$log', function ($window, $location, $log) {

    var factory = {};

    var _pageview = function (page) {
        if (typeof page !== 'undefined') {
            $window.ga('send', 'pageview', { page: page });
            //$log.info('pageview ' + page);
        }
        else {
            $window.ga('send', 'pageview', { page: $location.url() });
            //$log.info('pageview ' + $location.url());
        }
    }

    var _buttonclick = function (label) {
        $window.ga('send', 'event', 'button', 'click', label);
    }

    var _offersdisplayed = function () {
        $window.ga('send', 'event', 'quotation', 'display', 'offers');
    }
    
    factory.pageView = _pageview;
    factory.buttonClick = _buttonclick;
    factory.offersDisplayed = _offersdisplayed;

    return factory;
}])