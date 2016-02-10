module app.domain {
    export interface IMenuItem {
        link: string;
        isHeader: boolean;
        icon: string;
        name: string;
    }
}