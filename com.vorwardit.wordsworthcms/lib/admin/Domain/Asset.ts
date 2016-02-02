module app.domain {
    export interface IAsset {
        name: string;
        siteId: string;
        uri: string;
        file: string;
    }

    export class Asset implements IAsset {
        constructor(
            public name: string,
            public siteId: string,
            public uri: string,
            public file: string
        ) {
        }
    }
}