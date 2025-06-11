import { BookModel } from "./model/book.js";

export interface EnvironmentVariables extends NodeJS.ProcessEnv {
    readonly PORT: string;
}

export interface Params {
    isbn: string;
}

export interface QueryParams {
    keyword: string;
}

export type ReqBody = BookModel;
export type ResBody = BookModel;