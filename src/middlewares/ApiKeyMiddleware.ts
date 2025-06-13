import { Request, Response, NextFunction } from "express";
import { responseError } from "../utils/index.js";
import { CustomHeaders } from "../types/types.js";

export default class ApiKeyMiddleware {
    public static async validateKey(req: Request, res: Response, next: NextFunction): Promise<void> {
        // const apiKey: string | undefined = (<CustomHeaders>req.headers)["developerthai-api-key"];

        try {
            // if (!apiKey){
            //     throw new Error("api key ไม่ถูกต้องโปรดระบุ key ด้วย");
            // }
            next();
        } catch (e: unknown) {
            responseError(res, e);
        }
    }
};