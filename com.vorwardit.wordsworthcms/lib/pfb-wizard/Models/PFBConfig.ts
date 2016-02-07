module pfb.Models {
    export interface IPFBConfig {
        apiEndpoint: string;
        clientId: string;
        html5Routing?: boolean;
    }
}