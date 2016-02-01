module app.domain {
    export interface ILayout {
        layoutId: string;
        siteId: string;
        name: string;
        body: string;
    }

    export class Layout implements ILayout {
        constructor(
            public layoutId: string,
            public siteId: string,
            public name: string,
            public body: string
        ) {
        }
    }
}