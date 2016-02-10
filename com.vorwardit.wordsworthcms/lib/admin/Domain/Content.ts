module app.domain {
    export interface IContent {
        contentId: number;
        siteId: string;
        url: string;
        body: string;
    }
}