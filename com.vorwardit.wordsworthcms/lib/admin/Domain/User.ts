module app.domain {
    export interface IUser {
        userId: string;
        userName: string;
        password: string;
        type: number;
        siteId: string;
    }
}