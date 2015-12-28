(function () {
    'use strict';

    angular
        .module('app')
        .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$location']; 

    function WelcomeController($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'WelcomeController';

        activate();

        function activate() { }
    }
})();
