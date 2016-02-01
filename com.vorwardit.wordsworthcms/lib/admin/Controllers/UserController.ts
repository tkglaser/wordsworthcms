module app.controllers {
    class UserController {

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        users: app.domain.IUser[];
        user: app.domain.IUser;
        userTypes: app.domain.IUserType[];

        showPasswordBox: boolean;

        static modalHeadingNew: string = 'Neuen Nutzer anlegen';
        static modalHeadingEdit: string = 'Nutzer bearbeiten';
        modalHeading: string;

        static $inject = ['UserService', 'SiteService'];
        constructor(
            private UserService: app.services.IUserService,
            private SiteService: app.services.ISiteService) {
            this.getData();
            this.userTypes = app.domain.UserType.allTypes();
        }

        getData(): void {
            this.SiteService.getData().then((sites) => {
                this.sites = sites;
            });
            this.UserService.getAll().then((data) => {
                this.users = data;
            });
        }

        displayUserType(t: number): string {
            for (var i = 0; i < this.userTypes.length; ++i) {
                var type = this.userTypes[i];
                if (type.id == t) {
                    return type.name;
                }
            }
            return "Unbekannt";
        }

        newUser(): void {
            $('#saveError').hide();
            this.modalHeading = UserController.modalHeadingNew;
            this.showPasswordBox = true;
            this.user = new app.domain.User('', '', '', 2, '');
            $('#editModal').modal();
        };

        editUser(user: app.domain.IUser): void {
            $('#saveError').hide();
            this.modalHeading = UserController.modalHeadingEdit;
            this.showPasswordBox = false;
            this.user = new app.domain.User(user.userId, user.userName, '', user.type, user.siteId);
            $('#editModal').modal();
        };

        save(): void {
            if (this.user.userId == '') {
                var data = new app.domain.User('', this.user.userName, this.user.password, this.user.type, this.user.siteId);
                this.UserService.create(data).then(() => {
                    $('#editModal').modal("hide");
                    this.getData();
                },
                function () {
                    $('#saveError').show();
                });
            } else {
                var data = new app.domain.User(this.user.userId, this.user.userName, '', this.user.type, this.user.siteId);
                this.UserService.update(data).then(() => {
                    $('#editModal').modal("hide");
                    this.getData();
                },
                function () {
                    $('#saveError').show();
                });
            }
        }

        deleteUser(user: app.domain.IUser): void {
            $('#deleteError').hide();
            this.user = user;
            $('#deleteModal').modal();
        }

        deleteConfirmed(): void {
            this.UserService.remove(this.user.userId).then(() => {
                $('#deleteModal').modal('hide');
                this.getData();
            },
            function () {
                $('#deleteError').show();
            })
        }
    }

    angular
        .module('app')
        .controller('UserController', UserController);
}