module app.domain {
    export interface IPage {
        pageId: string;
        pageLayoutId: string;
        name: string;
        urls: IPageUrl[];
    }

    export class Page implements IPage {
        constructor(
            public pageId: string,
            public pageLayoutId: string,
            public name: string,
            public urls: IPageUrl[]
        ) {
        }
    }
}