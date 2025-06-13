import { IncomingHttpHeaders } from "http";

export interface EnvironmentVariables extends NodeJS.ProcessEnv {
    readonly PORT: string;
    readonly SECRET_KEY: string;
}

export interface BookParams {
    isbn: string;
}

export interface UserParams {
    userId: string;
}

export interface QueryParams {
    keyword: string;
}

export interface CustomHeaders extends IncomingHttpHeaders {
    readonly "developerthai-api-key": string | undefined;
}