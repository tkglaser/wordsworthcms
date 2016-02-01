module app.domain {
    export interface IMenuItem {
        link: string;
        isHeader: boolean;
        icon: string;
        name: string;
    }

    export class MenuItem implements IMenuItem {
        constructor(
            public link: string,
            public isHeader: boolean,
            public icon: string,
            public name: string) {
        }
    }
}