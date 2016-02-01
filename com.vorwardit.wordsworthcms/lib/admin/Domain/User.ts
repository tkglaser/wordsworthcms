module app.domain {
    export interface IUser {
        userName: string;
        password: string;
        type: number;
        siteId: string;
    }

    export class User implements IUser {
        constructor(
            public userName: string,
            public password: string,
            public type: number,
            public siteId: string
        ) {
        }
    }
}