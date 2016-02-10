var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var SiteController = (function () {
            function SiteController(SiteService) {
                this.SiteService = SiteService;
                this.getSites();
                this.modalHeading = SiteController.modalHeadingEdit;
            }
            SiteController.prototype.getSites = function () {
                var _this = this;
                this.SiteService.getData().then(function (sites) {
                    _this.sites = sites;
                });
            };
            SiteController.prototype.newSite = function () {
                $('#saveError').hide();
                this.modalHeading = SiteController.modalHeadingNew;
                this.site = {
                    siteId: '',
                    name: '',
                    bindings: []
                };
                this.site.name = '';
                this.site.bindings = [{ value: '' }];
                $('#editSiteModal').modal();
            };
            ;
            SiteController.prototype.editSite = function (site) {
                $('#saveError').hide();
                this.modalHeading = SiteController.modalHeadingEdit;
                this.site = {
                    siteId: site.siteId,
                    name: site.name,
                    bindings: []
                };
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
                var _this = this;
                this.SiteService.remove(this.site.siteId).then(function () {
                    $('#deleteSiteModal').modal('hide');
                    _this.getSites();
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
                var _this = this;
                var newSite = {
                    siteId: this.site.siteId,
                    name: this.site.name,
                    bindings: []
                };
                for (var i = 0; i < this.site.bindings.length; ++i) {
                    newSite.bindings.push(this.site.bindings[i].value);
                }
                this.SiteService.update(newSite).then(function () {
                    $('#editSiteModal').modal("hide");
                    _this.getSites();
                }, function () {
                    $('#saveError').show();
                });
            };
            SiteController.modalHeadingNew = 'Neuen Auftritt anlegen';
            SiteController.modalHeadingEdit = 'Auftritt bearbeiten';
            SiteController.$inject = ['SiteService'];
            return SiteController;
        })();
        angular
            .module('app')
            .controller('SiteController', SiteController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=SiteController.js.map