module app.domain {
    export interface ISite {
        siteId: string;
        name: string;
        bindings: string[];
    }

    export class Site implements ISite {
        constructor(
            public siteId: string,
            public name: string,
            public bindings: string[]) {
        }
    }
}