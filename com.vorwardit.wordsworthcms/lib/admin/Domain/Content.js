var app;
(function (app) {
    var domain;
    (function (domain) {
        var Content = (function () {
            function Content(contentId, siteId, url, body) {
                this.contentId = contentId;
                this.siteId = siteId;
                this.url = url;
                this.body = body;
            }
            return Content;
        })();
        domain.Content = Content;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=Content.js.map