'use strict';
app.factory('utilFactory', ['$timeout', '$log', '$q', function ($timeout, $log, $q) {
    var f = {};
    f.cumulativeOffset = function (element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: top,
            left: left
        };
    };

    f.jumpTo = function (eName) {
        $timeout(function () {
            var nav = document.getElementById('mainNavbar');
            var navHeight = nav.clientHeight;
            var elm = document.getElementById(eName);
            var st = f.cumulativeOffset(elm).top - navHeight - 10;
            $log.info('nav is ' + navHeight + ' high, jumping to ' + st);
            $("body,html").scrollTop(st);
        }, 500);
    }

    f.scrollTo = function (eName) {
        $timeout(function () {
            var nav = document.getElementById('mainNavbar');
            var navHeight = nav.clientHeight;
            var elm = document.getElementById(eName);
            var st = f.cumulativeOffset(elm).top - navHeight - 10;
            $log.info('nav is ' + navHeight + ' high, scolling to ' + st);
            $("body,html").animate({ scrollTop: st }, "slow");
        }, 500);
    }

    f.preloadImage = function (url) {
        var deffered = $q.defer(),
            image = new Image();

        image.src = url;
        if (image.complete) {
            deffered.resolve();
        } else {
            image.addEventListener('load', function () {
                deffered.resolve();
            });

            image.addEventListener('error', function () {
                deffered.reject();
            });
        }
        return deffered.promise;
    };

    f.getPlaceCountry = function (place) {
        for (var i = 0; i < place.address_components.length; i++) {
            for (var j = 0; j < place.address_components[i].types.length; j++) {
                if (place.address_components[i].types[j] == 'country') {
                    return place.address_components[i].short_name;
                }
            }
        }
        return 'UNKNOWN';
    }

    f.isoDateString = function(date){
        if (typeof (date) == 'undefined') {
            return null;
        }
        var curr_date = date.getDate();
        var curr_month = date.getMonth();
        var curr_year = date.getFullYear();
        return curr_year + "-" + (curr_month + 1) + "-" + curr_date;
    }

    return f;
}])