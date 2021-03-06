﻿module app.controllers {
    class MenuController {

        menuItems: app.domain.IMenuItem[] = [];

        static $inject = ['UserService'];
        constructor(private UserService: app.services.IUserService) {
            this.init();
        }

        init(): void {
            this.UserService.getUser().then((user) => {
                this.menuItems.push({
                    link: '',
                    isHeader: true,
                    icon: '',
                    name: 'MAIN MENU'
                });

                if (user.type <= 1) {
                    this.menuItems.push({
                        link: '/layouts',
                        isHeader: false,
                        icon: 'fa-anchor',
                        name: 'Layouts'
                    });
                };
                if (user.type <= 2) {
                    this.menuItems.push({
                        link: '/assets',
                        isHeader: false,
                        icon: 'fa-file',
                        name: 'Assets'
                    });
                }
                if (user.type <= 1) {
                    this.menuItems.push({
                        link: '/content',
                        isHeader: false,
                        icon: 'fa-clipboard',
                        name: 'Content'
                    });
                    this.menuItems.push({
                        link: '/pagelayouts',
                        isHeader: false,
                        icon: 'fa-book',
                        name: 'Page Layouts'
                    });
                }
                if (user.type <= 2) {
                    this.menuItems.push({
                        link: '/pages',
                        isHeader: false,
                        icon: 'fa-file',
                        name: 'Pages'
                    });
                }
                if (user.type == 0) {
                    this.menuItems.push({
                        link: '',
                        isHeader: true,
                        icon: '',
                        name: 'ADMINISTRATION'
                    });
                    this.menuItems.push({
                        link: '/sites',
                        isHeader: false,
                        icon: 'fa-home',
                        name: 'Sites'
                    });
                    this.menuItems.push({
                        link: '/users',
                        isHeader: false,
                        icon: 'fa-users',
                        name: 'User Management'
                    });
                }
            })
        }
    }

    angular
        .module('app')
        .controller('MenuController', MenuController);
}