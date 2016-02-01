module app.domain {
    export interface ISite {
        siteId: string;
        name: string;
        bindings: string[];
    }

    export class Site extends app.domain.EntityBase implements ISite {
        constructor(public siteId: string,
            public name: string,
            public bindings: string[]) {

            super();

            this.siteId = siteId;
            this.name = name;
            this.bindings = bindings;
        }
    }
}