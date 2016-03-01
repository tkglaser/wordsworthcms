module app.controllers {
    class ContentEditController {

        editor: any;

        sites: app.domain.ISite[] = [];
        site: app.domain.ISite;

        content: app.domain.IContent;

        static $inject = ['$routeParams', '$location', 'ContentService', 'SiteService'];
        constructor(
            private RouteParamsService: angular.route.IRouteParamsService,
            private LocationService: ng.ILocationService,
            private ContentService: app.services.IContentService,
            private SiteService: app.services.ISiteService) {
            var contentIdStr = RouteParamsService["id"];

            var contentId: number;
            if (contentIdStr == 'new') {
                contentId = -1;
            } else {
                contentId = parseInt(contentIdStr);
            }
            this.getContent(contentId);

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
            this.editor = CodeMirror.fromTextArea(document.getElementById("htmlEditorContent"), {
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

        getContent(id: number): void {
            this.SiteService.getData().then(
                (sites) => {
                    this.sites = sites;
                    this.site = this.SiteService.getSelectedSite(sites);
                    if (id == -1) {
                        this.content = {
                            contentId: -1,
                            siteId: this.site.siteId,
                            url: '',
                            body: ''
                        };
                        this.editor.setValue('');
                        setTimeout(() => {
                            this.editor.refresh();
                        }, 200);
                    } else {
                        this.ContentService.getData(id).then((data) => {
                            this.content = data;
                            this.editor.setValue(this.content.body);
                            setTimeout(() => {
                                this.editor.refresh();
                            }, 200);
                        });
                    }
                });
        }

        save(): void {
            this.content.body = this.editor.getValue();
            this.ContentService.update(this.content).then(
                () => {
                    this.LocationService.path('/content');
                },
                () => {
                    $('#saveError').show();
                });
        }
    }

    angular
        .module('app')
        .controller('ContentEditController', ContentEditController);
}