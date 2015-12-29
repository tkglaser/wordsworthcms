(function () {
    'use strict';

    angular
        .module('app')
        .controller('LayoutsController', LayoutsController);

    LayoutsController.$inject = ['$location', 'LayoutsFactory']; 

    function LayoutsController($location, LayoutsFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'LayoutsController';
        vm.layouts = [];

        activate();

        function activate() {
            LayoutsFactory.getData().success(function (data) {
                vm.layouts = data;
            });
        }
    }
})();
