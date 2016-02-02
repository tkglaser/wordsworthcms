module app.domain {
    export interface IContent {
        contentId: number;
        siteId: string;
        url: string;
        body: string;
    }

    export class Content implements IContent {
        constructor(
            public contentId: number,
            public siteId: string,
            public url: string,
            public body: string
        ) {
        }
    }
}