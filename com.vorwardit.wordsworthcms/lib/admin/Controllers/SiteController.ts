module app.controllers {

    class SiteController {

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        static modalHeadingNew: string = 'Neuen Auftritt anlegen';
        static modalHeadingEdit: string = 'Auftritt bearbeiten';
        modalHeading: string;

        static $inject = ['$location', 'SiteService'];
        constructor(private $location: ng.ILocationService, private SiteService: app.services.SiteService) {
            this.getSites();
            this.modalHeading = SiteController.modalHeadingEdit;

        }

        getSites(): void {
            var self = this;
            this.SiteService.getData().then(function (sites) {
                self.sites = sites;
            });
        }

        newSite() {
            $('#saveError').hide();
            this.modalHeading = SiteController.modalHeadingNew;
            this.site = new domain.Site('', '', []);
            this.site.name = '';
            this.site.bindings = [{ value: '' }];
            $('#editSiteModal').modal();
        };

        editSite(site: app.domain.ISite) {
            $('#saveError').hide();
            this.modalHeading = SiteController.modalHeadingEdit;
            this.site = new domain.Site(site.siteId, site.name, []);
            for (var i = 0; i < site.bindings.length; ++i) {
                this.site.bindings.push({
                    value: site.bindings[i]
                });
            }
            $('#editSiteModal').modal();
        };

        deleteSite(site: app.domain.ISite) {
            $('#deleteError').hide();
            this.site = site;
            $('#deleteSiteModal').modal();
        }

        deleteConfirmed() {
            var self = this;
            this.SiteService.remove(this.site.siteId).then(function () {
                $('#deleteSiteModal').modal('hide');
                self.getSites();
            },
            function () {
                $('#deleteError').show();
            })
        }

        addBinding() {
            this.site.bindings.push({ value: '' });
        }

        removeBinding(binding: any) {
            var index = this.site.bindings.indexOf(binding);
            this.site.bindings.splice(index, 1);
        }

        save() {
            var self = this;
            var newSite = new domain.Site(this.site.siteId, this.site.name, []);
            for (var i = 0; i < this.site.bindings.length; ++i) {
                newSite.bindings.push(this.site.bindings[i].value);
            }
            this.SiteService.update(newSite).then(function () {
                $('#editSiteModal').modal("hide");
                self.getSites();
            },
            function () {
                $('#saveError').show();
            });
        }

    }
    angular
        .module('app')
        .controller('SiteController', SiteController);
}