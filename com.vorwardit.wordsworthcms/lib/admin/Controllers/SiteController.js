var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var SiteController = (function () {
            function SiteController($location, SiteService) {
                this.$location = $location;
                this.SiteService = SiteService;
                this.getSites();
                this.modalHeading = SiteController.modalHeadingEdit;
            }
            SiteController.prototype.getSites = function () {
                var self = this;
                this.SiteService.getData().then(function (sites) {
                    self.sites = sites;
                });
            };
            SiteController.prototype.newSite = function () {
                $('#saveError').hide();
                this.modalHeading = SiteController.modalHeadingNew;
                this.site = new app.domain.Site('', '', []);
                this.site.name = '';
                this.site.bindings = [{ value: '' }];
                $('#editSiteModal').modal();
            };
            ;
            SiteController.prototype.editSite = function (site) {
                $('#saveError').hide();
                this.modalHeading = SiteController.modalHeadingEdit;
                this.site = new app.domain.Site(site.siteId, site.name, []);
                for (var i = 0; i < site.bindings.length; ++i) {
                    this.site.bindings.push({
                        value: site.bindings[i]
                    });
                }
                $('#editSiteModal').modal();
            };
            ;
            SiteController.prototype.deleteSite = function (site) {
                $('#deleteError').hide();
                this.site = site;
                $('#deleteSiteModal').modal();
            };
            SiteController.prototype.deleteConfirmed = function () {
                var self = this;
                this.SiteService.remove(this.site.siteId).then(function () {
                    $('#deleteSiteModal').modal('hide');
                    self.getSites();
                }, function () {
                    $('#deleteError').show();
                });
            };
            SiteController.prototype.addBinding = function () {
                this.site.bindings.push({ value: '' });
            };
            SiteController.prototype.removeBinding = function (binding) {
                var index = this.site.bindings.indexOf(binding);
                this.site.bindings.splice(index, 1);
            };
            SiteController.prototype.save = function () {
                var self = this;
                var newSite = new app.domain.Site(this.site.siteId, this.site.name, []);
                for (var i = 0; i < this.site.bindings.length; ++i) {
                    newSite.bindings.push(this.site.bindings[i].value);
                }
                this.SiteService.update(newSite).then(function () {
                    $('#editSiteModal').modal("hide");
                    self.getSites();
                }, function () {
                    $('#saveError').show();
                });
            };
            SiteController.modalHeadingNew = 'Neuen Auftritt anlegen';
            SiteController.modalHeadingEdit = 'Auftritt bearbeiten';
            SiteController.$inject = ['$location', 'SiteService'];
            return SiteController;
        })();
        angular
            .module('app')
            .controller('SiteController', SiteController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=SiteController.js.map