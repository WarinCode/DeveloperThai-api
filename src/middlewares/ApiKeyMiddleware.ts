import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getToken, isApiKeyExpired, responseError } from "../utils/index.js";
import { CustomHeaders } from "../types/types.js";
import HttpResponseError from "../error/HttpResponseError.js";
import { isApiKeyExists, isApiKeyActive, isAuthorized } from "../utils/index.js";
import { UserModel } from "../types/models/user.js";

export default class ApiKeyMiddleware {
    public static async validateKey({ headers }: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(1);
        const key: string | undefined = (<CustomHeaders>headers)["developerthai-api-key"];
        console.log(key);

        try {
            if (!isAuthorized(headers.authorization)) {
                throw new HttpResponseError("ผู้ใช้งานยืนยันตัวตนไม่ถูกต้อง!", 403);
            }

            if (!key) {
                throw new HttpResponseError("ไม่ได้แนบ api key มาโปรดระบุ key ด้วย!");
            }

            const token: string = getToken(headers.authorization);
            const { userId }: UserModel & JwtPayload = <UserModel & JwtPayload>jwt.decode(token);
            if (await isApiKeyExists("key", key) && await isApiKeyActive(userId) && !await isApiKeyExpired(userId)) {
                console.log(2);
                next();
                return;
            } else if (!await isApiKeyActive(userId) && await isApiKeyExists("key", key)) {
                throw new HttpResponseError("api key ถูกปิดใช้งานอยู่!");
            } else if (await isApiKeyExpired(userId) && await isApiKeyExists("key", key)) {
                throw new HttpResponseError("api key หมดอายุใช้งานแล้วโปรดสร้าง key ใหม่!");
            }

            throw new HttpResponseError(`api key '${key}' นี้ไม่ถูกต้อง!`);
        } catch (e: unknown) {
            responseError(res, e);
        }
    }
};