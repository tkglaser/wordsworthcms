module app.domain {
    export interface IPageUrl {
        pageUrlId: number;
        url: string;
    }

    export class PageUrl implements IPageUrl {
        constructor(
            public pageUrlId: number,
            public url: string
        ) {
        }
    }
}