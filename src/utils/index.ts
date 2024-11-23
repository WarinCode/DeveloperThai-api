import { Response } from "express";

export function responseError(res: Response, e: any | Error, statusCode?: number) {
  if (e instanceof Error) {
    console.error(e.message);
    res.status(statusCode ?? 500).json({
      message: e.message,
    });
  }
}