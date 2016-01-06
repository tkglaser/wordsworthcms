app.directive('dateField', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            function toUser(date) {
                if (typeof (date) == 'undefined') {
                    return '';
                }
                var curr_date = date.getDate();
                var curr_month = date.getMonth();
                var curr_year = date.getFullYear();
                return curr_date + "." + (curr_month + 1) + "." + curr_year;
            }

            ngModel.$formatters.push(toUser);
        }
    };
})