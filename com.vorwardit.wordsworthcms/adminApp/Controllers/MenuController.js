(function () {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$location', 'PermissionFactory']; 

    function MenuController($location, PermissionFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'MenuController';
        vm.menuItems = [
            {
                link: '/sites',
                icon: 'fa-home',
                name: 'Webauftritte'
            },
            {
                link: '/layouts',
                icon: 'fa-anchor',
                name: 'Layouts'
            },
            {
                link: '/assets',
                icon: 'fa-file',
                name: 'Assets'
            },
            {
                link: '/content',
                icon: 'fa-clipboard',
                name: 'Content'
            },
            {
                link: '/pagelayouts',
                icon: 'fa-book',
                name: 'Seitenlayouts'
            },
            {
                link: '/pages',
                icon: 'fa-file',
                name: 'Seiten'
            },
        ];

        activate();

        function activate() { }
    }
})();
