declare var CodeMirror: any;

module app.controllers {
    class LayoutEditController {

        editor: any;

        sites: app.domain.ISite[];
        site: app.domain.ISite;

        layout: app.domain.ILayout;

        layoutId: string;

        static $inject = ['$routeParams', '$location', 'LayoutService', 'SiteService'];
        constructor(
            private RouteParamsService: ng.route.IRouteParamsService,
            private LocationService: ng.ILocationService,
            private LayoutService: app.services.ILayoutService,
            private SiteService: app.services.ISiteService)
        {
            this.layoutId = RouteParamsService["id"];
            this.getLayout(this.layoutId);
            var mixedMode = {
                name: "htmlmixed",
                scriptTypes: [{
                    matches: /\/x-handlebars-template|\/x-mustache/i,
                    mode: null
                },
                    {
                        matches: /(text|application)\/(x-)?vb(a|script)/i,
                        mode: "vbscript"
                    }]
            };
            this.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditorLayouts"), {
                mode: mixedMode,
                selectionPointer: true,
                extraKeys: {
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function (cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    }
                }
            });
        }

        getLayout(id: string): void {
            this.SiteService.getData().then(
                (data) => {
                    this.sites = data;
                    this.site = this.SiteService.getSelectedSite(data);
                    if (id == "new") {
                        this.layout = {
                            layoutId: '',
                            siteId: this.site.siteId,
                            body: '',
                            name: ''
                        };
                        this.editor.setValue('');
                        setTimeout(() => {
                            this.editor.refresh();
                        }, 200);
                    } else {
                        this.LayoutService.getData(id).then(
                            (data) => {
                                this.layout = data;
                                this.editor.setValue(this.layout.body);
                                setTimeout(() => {
                                    this.editor.refresh();
                                }, 200);
                            }
                        );
                    }
                });
        }

        save(): void {
            this.layout.body = this.editor.getValue();
            this.LayoutService.update(this.layout).then(
                () => {
                    this.LocationService.path('/layouts');
                },
                () => {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('LayoutEditController', LayoutEditController);
}