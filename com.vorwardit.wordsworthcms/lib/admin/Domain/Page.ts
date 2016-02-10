module app.domain {
    export interface IPage {
        pageId: string;
        pageLayoutId: string;
        name: string;
        urls: IPageUrl[];
    }
}