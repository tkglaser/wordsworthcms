module app.domain {
    export interface IUserType {
        id: number;
        name: string;
    }

    export class UserType implements IUserType {
        constructor(
            public id: number,
            public name: string
        ) {
        }

        static allTypes(): IUserType[] {
            var result: UserType[] = [];
            result.push(new UserType(0, "Administrator"));
            result.push(new UserType(1, "Designer"));
            result.push(new UserType(2, "Editor"));
            return result;
        }
    }
}