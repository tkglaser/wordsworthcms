﻿(function() {
    'use strict';

    angular
        .module('app')
        .directive('fileModel', FileModelDirective);

    FileModelDirective.$inject = ['$window', '$parse'];
    
    function FileModelDirective ($window, $parse) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    }

})();