module app.directives {

    FileModelDirective.$inject = ['$window', '$parse'];
    function FileModelDirective(
        $window: ng.IWindowService,
        $parse: ng.IParseService
    ): ng.IDirective {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope: ng.IScope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    }

    angular
        .module('app')
        .directive('fileModel', FileModelDirective);
}