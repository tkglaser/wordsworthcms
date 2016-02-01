module app.domain {
    export interface IUser {
        userId: string;
        userName: string;
        password: string;
        type: number;
        siteId: string;
    }

    export class User implements IUser {
        constructor(
            public userId: string,
            public userName: string,
            public password: string,
            public type: number,
            public siteId: string
        ) {
        }
    }
}