(function () {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$location', 'UserFactory']; 

    function MenuController($location, UserFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'MenuController';
        vm.menuItems = [];

        activate();

        function activate() {
            UserFactory.getUser().success(function (user) {
                if (user.type == 0) {
                    vm.menuItems.push({
                        link: '/sites',
                        icon: 'fa-home',
                        name: 'Webauftritte'
                    });
                }
                if (user.type <= 1) {
                    vm.menuItems.push({
                        link: '/layouts',
                        icon: 'fa-anchor',
                        name: 'Layouts'
                    });
                    vm.menuItems.push({
                        link: '/assets',
                        icon: 'fa-file',
                        name: 'Assets'
                    });
                    vm.menuItems.push({
                        link: '/content',
                        icon: 'fa-clipboard',
                        name: 'Content'
                    });
                    vm.menuItems.push({
                        link: '/pagelayouts',
                        icon: 'fa-book',
                        name: 'Seitenlayouts'
                    });
                }
                if (user.type <= 2) {
                    vm.menuItems.push({
                        link: '/pages',
                        icon: 'fa-file',
                        name: 'Seiten'
                    });
                }
                if (user.type == 0) {
                    vm.menuItems.push({
                        link: '/users',
                        icon: 'fa-users',
                        name: 'Nutzerverwaltung'
                    });
                }
            })
        }
    }
})();
