var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var PageController = (function () {
            function PageController(PageService, SiteService, PageLayoutService) {
                this.PageService = PageService;
                this.SiteService = SiteService;
                this.PageLayoutService = PageLayoutService;
                this.pages = [];
                this.pageversions = [];
                this.pageLayouts = [];
                this.sites = [];
                this.getData();
            }
            PageController.prototype.getData = function () {
                var _this = this;
                this.SiteService.getData().then(function (data) {
                    _this.sites = data;
                    _this.site = _this.SiteService.getSelectedSite(data);
                    _this.PageService.getBySiteId(_this.site.siteId).then(function (data) {
                        _this.pages = data;
                    });
                    _this.PageLayoutService.getBySiteId(_this.site.siteId).then(function (data) {
                        _this.pageLayouts = data;
                    });
                });
            };
            ;
            PageController.prototype.siteChanged = function () {
                var _this = this;
                this.SiteService.setSelectedSite(this.site);
                this.PageService.getBySiteId(this.site.siteId).then(function (data) {
                    _this.pages = data;
                });
                this.PageLayoutService.getBySiteId(this.site.siteId).then(function (data) {
                    _this.pageLayouts = data;
                });
            };
            ;
            PageController.prototype.create = function () {
                $('#saveError').hide();
                this.modalHeading = PageController.modalHeadingNew;
                this.page = new app.domain.Page('', '', '', [{ url: '', pageUrlId: -1 }]);
                $('#editModal').modal();
            };
            ;
            PageController.prototype.edit = function (page) {
                var _this = this;
                this.PageService.getData(page.pageId).then(function (data) {
                    $('#saveError').hide();
                    _this.modalHeading = PageController.modalHeadingEdit;
                    _this.page = data;
                    $('#editModal').modal();
                });
            };
            ;
            PageController.prototype.editContent = function (page) {
                var _this = this;
                $('#saveContentError').hide();
                this.PageService.getVersions(page.pageId).then(function (data) {
                    if (data.length > 0) {
                        _this.pageversion = data[0];
                    }
                    else {
                        _this.pageversion = new app.domain.PageVersion(page.pageId, '', '');
                    }
                    $('#editContentModal').modal();
                });
            };
            PageController.prototype.showVersions = function (page) {
                var _this = this;
                $('#publishError').hide();
                this.page = page;
                this.PageService.getVersions(page.pageId).then(function (data) {
                    _this.pageversions = data;
                    $('#publishModal').modal();
                });
            };
            PageController.prototype.newVersion = function () {
                var _this = this;
                this.PageService.createNewVersion(this.page.pageId).then(function () {
                    _this.PageService.getVersions(_this.page.pageId).then(function (data) {
                        _this.pageversions = data;
                    });
                });
            };
            PageController.prototype.publish = function (versionId) {
                var _this = this;
                this.PageService.publish(versionId).then(function () {
                    _this.PageService.getVersions(_this.page.pageId).then(function (data) {
                        _this.pageversions = data;
                    });
                }, function () {
                    $('#publishError').show();
                });
            };
            PageController.prototype.addUrl = function () {
                this.page.urls.push(new app.domain.PageUrl(-1, ''));
            };
            PageController.prototype.removeUrl = function (url) {
                var index = this.page.urls.indexOf(url);
                this.page.urls.splice(index, 1);
            };
            PageController.prototype.delete = function (page) {
                $('#deleteError').hide();
                this.page = page;
                $('#deleteModal').modal();
            };
            PageController.prototype.deleteConfirmed = function () {
                var _this = this;
                this.PageService.remove(this.page.pageId).then(function () {
                    $('#deleteModal').modal('hide');
                    _this.getData();
                }, function () {
                    $('#deleteError').show();
                });
            };
            PageController.prototype.save = function () {
                var _this = this;
                this.PageService.update(this.page).then(function () {
                    $('#editModal').modal("hide");
                    _this.getData();
                }, function () {
                    $('#saveError').show();
                });
            };
            PageController.prototype.saveVersion = function () {
                var _this = this;
                this.PageService.updateVersion(this.pageversion).then(function () {
                    $('#editContentModal').modal("hide");
                    _this.getData();
                }, function () {
                    $('#saveContentError').show();
                });
            };
            PageController.modalHeadingNew = 'Neue Seite anlegen';
            PageController.modalHeadingEdit = 'Seite bearbeiten';
            PageController.$inject = ['PageService', 'SiteService', 'PageLayoutService'];
            return PageController;
        })();
        angular
            .module('app')
            .controller('PageController', PageController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=PageController.js.map