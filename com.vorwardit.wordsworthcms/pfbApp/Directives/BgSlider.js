app.directive('bgSlider', ['$window', '$timeout', '$location', '$animate', '$log', 'utilFactory',
function ($window, $timeout, $location, $animate, $log, utilFactory) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, elem, attrs) {
            scope.inPreload = false;
            scope.classes = [
                {
                    cls: 'bg-slider-slide-1',
                    src: '/Content/img/Fotolia_77237393_L.jpg'
                },
                {
                    cls: 'bg-slider-slide-2',
                    src: '/Content/img/Fotolia_16767479_L.jpg'
                },
                {
                    cls: 'bg-slider-slide-3',
                    src: '/Content/img/Fotolia_75745312_L.jpg'
                }
            ];

            scope.currentIndex = 0; // Initially the index is at the first image

            scope.next = function () {
                if (!scope.inPreload) {
                    scope.currentIndex < scope.classes.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                    $log.info('imageid set to ', scope.currentIndex);
                }
                else {
                    $log.info('waiting for preload');
                }
            };

            scope.$watch('currentIndex', function () {
                if (angular.element($window).width() < 768) {
                    return;
                }
                scope.inPreload = true;
                // 1. Preload
                $log.info('Start Preload ' + scope.classes[scope.currentIndex].src + ' id ' + scope.currentIndex);
                utilFactory.preloadImage(scope.classes[scope.currentIndex].src)
                .then(function () {
                    // 2. Switch
                    $log.info('Preload finished');
                    scope.classes.forEach(function (classname) {
                        if (elem.hasClass(classname.cls)) {
                            $animate.removeClass(elem, classname.cls);
                        }
                    });
                    $animate.addClass(elem, scope.classes[scope.currentIndex].cls);
                    $animate.removeClass(elem, 'bg-slider-initial');
                    scope.inPreload = false;
                })
            });

            var timer;
            var sliderFunc = function () {
                timer = $timeout(function () {
                    if ($location.path() == '/') {
                        scope.next();
                    }
                    timer = $timeout(sliderFunc, 7000);
                }, 7000);
            };

            sliderFunc();

            scope.$on('$destroy', function () {
                $timeout.cancel(timer);
            });
        }
    }
}])