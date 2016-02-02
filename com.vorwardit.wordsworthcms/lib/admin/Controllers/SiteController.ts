﻿module app.controllers {

    class SiteController {

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        static modalHeadingNew: string = 'Neuen Auftritt anlegen';
        static modalHeadingEdit: string = 'Auftritt bearbeiten';
        modalHeading: string;

        static $inject = ['SiteService'];
        constructor(private SiteService: app.services.ISiteService) {
            this.getSites();
            this.modalHeading = SiteController.modalHeadingEdit;
        }

        getSites(): void {
            this.SiteService.getData().then(
                (sites) => {
                    this.sites = sites;
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
            this.SiteService.remove(this.site.siteId).then(
                () => {
                    $('#deleteSiteModal').modal('hide');
                    this.getSites();
                },
                () => {
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
            var newSite = new domain.Site(this.site.siteId, this.site.name, []);
            for (var i = 0; i < this.site.bindings.length; ++i) {
                newSite.bindings.push(this.site.bindings[i].value);
            }
            this.SiteService.update(newSite).then(
                () => {
                    $('#editSiteModal').modal("hide");
                    this.getSites();
                },
                () => {
                    $('#saveError').show();
                });
        }

    }
    angular
        .module('app')
        .controller('SiteController', SiteController);
}