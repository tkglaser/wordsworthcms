module app.domain {
    export interface IPageLayout {
        pageLayoutId: string;
        layoutId: string;
        name: string;
        body: string;
    }

    export class PageLayout implements IPageLayout {
        constructor(
            public pageLayoutId: string,
            public layoutId: string,
            public name: string,
            public body: string
        ) {
        }
    }
}