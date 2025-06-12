import { BookModel } from "./models/book.js";

export interface EnvironmentVariables extends NodeJS.ProcessEnv {
    readonly SECRET_KEY: string;
}

export interface Params {
    isbn: string;
}

export interface QueryParams {
    keyword: string;
}

export type ReqBody = BookModel;
export type ResBody = BookModel;

export interface UserParams {
    userId: string;
}