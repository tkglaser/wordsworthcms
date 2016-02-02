module app.domain {
    export interface IPageVersion {
        pageId: string;
        title: string;
        metaDescription: string;
    }

    export class PageVersion implements IPageVersion {
        constructor(
            public pageId: string,
            public title: string,
            public metaDescription: string
        ) {
        }
    }
}