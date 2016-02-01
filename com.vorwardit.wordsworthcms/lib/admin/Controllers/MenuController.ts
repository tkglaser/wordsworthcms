module app.controllers {
    class MenuController {

        menuItems: app.domain.IMenuItem[] = [];

        static $inject = ['UserService'];
        constructor(private UserService: app.services.IUserService) {
            this.init();
        }

        init(): void {
            this.UserService.getUser().then((user) => {
                this.menuItems.push(new app.domain.MenuItem('', true, '', 'HAUPTMENÜ'));

                if (user.type <= 1) {
                    this.menuItems.push(new app.domain.MenuItem('/layouts', false, 'fa-anchor', 'Layouts'));
                };
                if (user.type <= 2) {
                    this.menuItems.push(new app.domain.MenuItem('/assets', false, 'fa-file', 'Assets'));
                }
                if (user.type <= 1) {
                    this.menuItems.push(new app.domain.MenuItem('/content', false, 'fa-clipboard', 'Content'));
                    this.menuItems.push(new app.domain.MenuItem('/pagelayouts', false, 'fa-book', 'Seitenlayouts'));
                }
                if (user.type <= 2) {
                    this.menuItems.push(new app.domain.MenuItem('/pages', false, 'fa-file', 'Seiten'));
                }
                if (user.type == 0) {
                    this.menuItems.push(new app.domain.MenuItem('', true, '', 'ADMINISTRATION'));
                    this.menuItems.push(new app.domain.MenuItem('/sites', false, 'fa-home', 'Webauftritte'));
                    this.menuItems.push(new app.domain.MenuItem('/users', false, 'fa-users', 'Nutzerverwaltung'));
                }
            })
        }
    }

    angular
        .module('app')
        .controller('MenuController', MenuController);
}