import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { responseError, getToken } from "../utils/index.js";
import { EnvironmentVariables } from "../types/types.js";
import { UserModel } from "../types/models/user.js";
import HttpResponseError from "../error/HttpResponseError.js";

export default class AuthMiddleware {
  public static authorization(
    { headers: { authorization } }: Request,
    res: Response,
    next: NextFunction
  ): void {
    const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;

    try {
      if (!this.isAuthorized(authorization)) {
        new HttpResponseError("โปรดระบุยืนยันตัวตนผู้ใช้งานก่อน!", 401);
      }

      const token: string = getToken(authorization);
      const decoded: UserModel | string | JwtPayload = jwt.verify(
        token,
        secretKey
      );

      if (decoded) next();
    } catch (e: unknown) {
      if (e instanceof jwt.JsonWebTokenError) {
        responseError(
          res,
          new HttpResponseError(
            "ผู้ใช้งานไม่ได้รับอณุณาติให้เข้าถึงข้อมูล!",
            403
          )
        );
      } else if (e instanceof jwt.TokenExpiredError) {
        responseError(
          res,
          new HttpResponseError(
            "token ยืนยันตัวตนผู้ใช้งานหมดอายุโปรด login ใหม่!"
          )
        );
      } else {
        responseError(res, e);
      }
    }
  }

  public static isAuthorized(authorization: string | undefined): boolean {
    const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;
    let isVerifyError: boolean = false;

    if (!authorization || !authorization?.startsWith("Bearer")) {
      return false;
    }

    const token: string = getToken(authorization);
    jwt.verify(token, secretKey, (err: VerifyErrors | null): void => {
      if (err instanceof jwt.JsonWebTokenError || err !== null) {
        isVerifyError = true;
      } else {
        isVerifyError = false;
      }
    });

    if (isVerifyError) {
      return false;
    }

    return true;
  }
}
