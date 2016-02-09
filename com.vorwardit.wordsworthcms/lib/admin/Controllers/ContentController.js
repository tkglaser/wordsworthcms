var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var ContentController = (function () {
            function ContentController(ContentService, SiteService) {
                this.ContentService = ContentService;
                this.SiteService = SiteService;
                this.sites = [];
                this.contents = [];
                this.getData();
            }
            ContentController.prototype.getData = function () {
                var _this = this;
                this.SiteService.getData().then(function (sites) {
                    _this.sites = sites;
                    _this.site = _this.SiteService.getSelectedSite(sites);
                    _this.ContentService.getBySiteId(_this.site.siteId).then(function (contents) {
                        _this.contents = contents;
                    });
                });
            };
            ;
            ContentController.prototype.siteChanged = function () {
                var _this = this;
                this.SiteService.setSelectedSite(this.site);
                this.ContentService.getBySiteId(this.site.siteId).then(function (data) {
                    _this.contents = data;
                });
            };
            ;
            ContentController.prototype.create = function () {
                $('#saveError').hide();
                this.modalHeading = ContentController.modalHeadingNew;
                this.content = new app.domain.Content(-1, '', '', '');
                $('#editModal').modal();
            };
            ;
            ContentController.prototype.edit = function (content) {
                var _this = this;
                this.ContentService.getData(content.contentId).then(function (data) {
                    $('#saveError').hide();
                    _this.modalHeading = ContentController.modalHeadingEdit;
                    _this.content = data;
                    $('#editModal').modal();
                });
            };
            ;
            ContentController.prototype.delete = function (content) {
                $('#deleteError').hide();
                this.content = content;
                $('#deleteModal').modal();
            };
            ContentController.prototype.deleteConfirmed = function () {
                var _this = this;
                this.ContentService.remove(this.content.contentId).then(function () {
                    $('#deleteModal').modal('hide');
                    _this.getData();
                }, function () {
                    $('#deleteError').show();
                });
            };
            ContentController.prototype.save = function () {
                var _this = this;
                var data = new app.domain.Content(this.content.contentId, this.site.siteId, this.content.url, this.content.body);
                this.ContentService.update(data).then(function () {
                    $('#editModal').modal("hide");
                    _this.getData();
                }, function () {
                    $('#saveError').show();
                });
            };
            ContentController.modalHeadingNew = 'Neuen Content anlegen';
            ContentController.modalHeadingEdit = 'Content bearbeiten';
            ContentController.$inject = ['ContentService', 'SiteService'];
            return ContentController;
        })();
        angular
            .module('app')
            .controller('ContentController', ContentController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=ContentController.js.map