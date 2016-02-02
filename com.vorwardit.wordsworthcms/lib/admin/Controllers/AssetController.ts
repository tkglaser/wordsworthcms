module app.controllers {
    class AssetController {

        assets: app.domain.IAsset[] = [];
        asset: app.domain.IAsset;

        sites: app.domain.ISite[] = [];
        site: app.domain.ISite;

        static $inject = ['AssetService', 'SiteService'];
        constructor(
            private AssetService: app.services.IAssetService,
            private SiteService: app.services.ISiteService) {
            this.getData();
        }

        getData(): void {
            this.SiteService.getData().then((sites) => {
                this.sites = sites;
                this.site = this.SiteService.getSelectedSite(sites);
                this.AssetService.getData(this.site.siteId).then((assets) => {
                    this.assets = assets;
                });
            });
        }

        siteChanged(): void {
            this.SiteService.setSelectedSite(this.site);
            this.AssetService.getData(this.site.siteId).then((data) => {
                this.assets = data;
            });
        };

        create(): void {
            $('#saveError').hide();
            $('#editModal').modal();
        };

        delete(asset: app.domain.IAsset): void {
            $('#deleteError').hide();
            this.asset = asset;
            $('#deleteModal').modal();
        }

        deleteConfirmed(): void {
            this.AssetService.remove(this.site.siteId, this.asset.name).then(
                () => {
                    $('#deleteModal').modal('hide');
                    this.getData();
                },
                () => {
                    $('#deleteError').show();
                })
        }

        save(): void {
            this.asset.siteId = this.site.siteId;
            this.AssetService.upload(this.asset).then(
                () => {
                    $('#editModal').modal("hide");
                    this.getData();
                },
                () => {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('AssetController', AssetController);
}