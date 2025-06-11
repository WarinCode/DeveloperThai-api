import { ZodError } from "zod";
import { Response } from "express";
import path from "path"
import { fileURLToPath } from 'url';
import Reader from "./classes/Reader.js";
import { Users, UserModel } from "../types/models/user.js";

export const responseError = (res: Response, e: unknown | Error, statusCode?: number) => {
  if (e instanceof ZodError) {
    console.error(e.toString());
    res.type("json").status(statusCode ?? 500).json({
      message: e.errors,
    });
  } else if (e instanceof Error) {
    console.error(e.message);
    res.type("json").status(statusCode ?? 500).json({
      message: e.message,
    });
  }
}

export const getRootPath = (): string => {
  const file: string = fileURLToPath(import.meta.url);
  const dirname: string = path.dirname(file).replace("\\src\\utils", "");
  return dirname;
}

export const getDataPath = (filename: string = "books.json"): string => {
  return path.join(getRootPath(), "src", "data", filename);
}

export const getStaticPath = (): string => {
  return path.join(getRootPath(), "public");
}

export const testing = async (cb: () => void | Promise<void>, isRun: true | false = true) => {
  if (!isRun) return;

  try {
    await cb();
    console.log("รันทดสอบสำเร็จ");
  } catch (e: unknown) {
    console.error(e);
    console.error("รันทดสอบล้มเหลว!");
  }
}

export async function isUserExists(userId: string): Promise<boolean>;
export async function isUserExists(userParam: UserModel): Promise<boolean>;
export async function isUserExists(param: string | UserModel): Promise<boolean> {
  const users: Users | null = await Reader.readAllData<Users>("users.json");

  if (!users) {
    throw new Error("ไม่สามารถอ่านข้อมูล users ได้!");
  }

  if (typeof param === "string") {
    return users.some((user: UserModel): boolean => user.userId === param);
  }

  return users.some((user: UserModel): boolean => user.userId !== param.userId && (user.username === param.username || user.email === param.email));
}

export const generateUserId = async (length: number = 40): Promise<string> => {
  let userId: string = "";
  const charsets: string[] = [
    ..."abcdefghijklmnopqrstuvwxyz",
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ..."0123456789"
  ];

  for (let i: number = 0; i < length; i++) {
    userId += charsets[Math.floor(Math.random() * charsets.length)];
  }

  if (await isUserExists(userId)) {
    return generateUserId(length);
  }

  return userId;
}

export const getUserbyId = async (userId: string): Promise<UserModel | null> => {
  const users: Users | null = await Reader.readAllData<Users>("users.json");

  if (!users) {
    throw new Error("ไม่สามารถอ่านข้อมูล users ได้!");
  }

  for (const user of users) {
    if (userId === user.userId) {
      return user;
    }
  }

  return null;
}