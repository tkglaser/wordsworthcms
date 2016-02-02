var app;
(function (app) {
    var controllers;
    (function (controllers) {
        var AssetController = (function () {
            function AssetController(AssetService, SiteService) {
                this.AssetService = AssetService;
                this.SiteService = SiteService;
                this.assets = [];
                this.sites = [];
                this.getData();
            }
            AssetController.prototype.getData = function () {
                var _this = this;
                this.SiteService.getData().then(function (sites) {
                    _this.sites = sites;
                    _this.site = _this.SiteService.getSelectedSite(sites);
                    _this.AssetService.getData(_this.site.siteId).then(function (assets) {
                        _this.assets = assets;
                    });
                });
            };
            AssetController.prototype.siteChanged = function () {
                var _this = this;
                this.SiteService.setSelectedSite(this.site);
                this.AssetService.getData(this.site.siteId).then(function (data) {
                    _this.assets = data;
                });
            };
            ;
            AssetController.prototype.create = function () {
                $('#saveError').hide();
                $('#editModal').modal();
            };
            ;
            AssetController.prototype.delete = function (asset) {
                $('#deleteError').hide();
                this.asset = asset;
                $('#deleteModal').modal();
            };
            AssetController.prototype.deleteConfirmed = function () {
                var _this = this;
                this.AssetService.remove(this.site.siteId, this.asset.name).then(function () {
                    $('#deleteModal').modal('hide');
                    _this.getData();
                }, function () {
                    $('#deleteError').show();
                });
            };
            AssetController.prototype.save = function () {
                var _this = this;
                this.asset.siteId = this.site.siteId;
                this.AssetService.upload(this.asset).then(function () {
                    $('#editModal').modal("hide");
                    _this.getData();
                }, function () {
                    $('#saveError').show();
                });
            };
            AssetController.$inject = ['AssetService', 'SiteService'];
            return AssetController;
        })();
        angular
            .module('app')
            .controller('AssetController', AssetController);
    })(controllers = app.controllers || (app.controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=AssetController.js.map