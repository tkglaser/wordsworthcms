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
                vm.menuItems.push({
					isHeader: true,
                    name: 'HAUPTMENÜ'
                });
                if (user.type <= 1) {
                    vm.menuItems.push({
                        link: '/layouts',
						isHeader: false,
                        icon: 'fa-anchor',
                        name: 'Layouts'
                    });
				};
                if (user.type <= 2) {
					vm.menuItems.push({
						link: '/assets',
						isHeader: false,
						icon: 'fa-file',
						name: 'Assets'
					});
				}
                if (user.type <= 1) {
                    vm.menuItems.push({
                        link: '/content',
						isHeader: false,
                        icon: 'fa-clipboard',
                        name: 'Content'
                    });
                    vm.menuItems.push({
                        link: '/pagelayouts',
						isHeader: false,
                        icon: 'fa-book',
                        name: 'Seitenlayouts'
                    });
                }
                if (user.type <= 2) {
                    vm.menuItems.push({
                        link: '/pages',
						isHeader: false,
                        icon: 'fa-file',
                        name: 'Seiten'
                    });
                }
                if (user.type == 0) {
					vm.menuItems.push({
						isHeader: true,
						name: 'ADMINISTRATION'
					});
                    vm.menuItems.push({
                        link: '/sites',
						isHeader: false,
                        icon: 'fa-home',
                        name: 'Webauftritte'
                    });
                    vm.menuItems.push({
                        link: '/users',
						isHeader: false,
                        icon: 'fa-users',
                        name: 'Nutzerverwaltung'
                    });
                }
            })
        }
    }
})();
