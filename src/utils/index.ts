import { ZodError } from "zod";
import { Response } from "express";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import DataReader from "./classes/DataReader.js";
import HttpResponseError from "../error/HttpResponseError.js";
import FileNotFoundError from "../error/FileNotFoundError.js";
import { Users, UserModel, UserLogin } from "../types/models/user.js";
import { DataFiles } from "../types/types.js";
import { UserApiKey, UserApiKeys } from "../types/models/userApiKey.js";

export const responseError = (
  res: Response,
  e: unknown | Error,
  statusCode?: number
) => {
  if (e instanceof HttpResponseError) {
    console.error(e.getMessage());
    res
      .type("json")
      .status(e.getStatusCode())
      .json({ message: e.getMessage() });
  } else if (e instanceof FileNotFoundError) {
    console.error(e.getMessage());
    res
      .type("json")
      .status(statusCode ?? 500)
      .json({ message: e.getTemplateMessage() ?? e.getMessage() });
  } else if (e instanceof ZodError) {
    console.error(e.toString());
    res
      .type("json")
      .status(statusCode ?? 500)
      .json({
        message: e.errors,
      });
  } else if (e instanceof Error) {
    console.error(e.message);
    res
      .type("json")
      .status(statusCode ?? 500)
      .json({
        message: e.message,
      });
  }
};

export const getRootPath = (): string => {
  const file: string = fileURLToPath(import.meta.url);
  const dirname: string = path.dirname(file).replace("\\src\\utils", "");
  return dirname;
};

export const getDataPath = (filename: DataFiles): string => {
  return path.join(getRootPath(), "src", "data", filename);
};

export const getStaticPath = (): string => {
  return path.join(getRootPath(), "public");
};

export const testing = async (
  cb: () => void | Promise<void>,
  isRun: boolean = true
) => {
  if (!isRun) return;

  try {
    await cb();
    console.log("รันทดสอบสำเร็จ");
  } catch (e: unknown) {
    console.error(e);
    console.error("รันทดสอบล้มเหลว!");
  }
};

export async function isUserExists(userId: string): Promise<boolean>;
export async function isUserExists(user: UserModel): Promise<boolean>;
export async function isUserExists(
  param: string | UserModel
): Promise<boolean> {
  const users: Users | null = await DataReader.readAllData<Users>("users.json");

  if (!users) {
    throw new FileNotFoundError("ไม่สามารถเปิดอ่านข้อมูลได้!", "users.json");
  }

  if (typeof param === "string") {
    return users.some((user: UserModel): boolean => user.userId === param);
  }

  return users.some(
    (user: UserModel): boolean =>
      user.userId !== param.userId &&
      (user.username === param.username || user.email === param.email)
  );
}

export const isApiKeyExists = async (key: string): Promise<boolean> => {
  const keys: UserApiKeys | null = await DataReader.readAllData<UserApiKeys>(
    "api-keys.json"
  );

  if (!keys) {
    throw new FileNotFoundError("ไม่สามารถเปิดอ่านข้อมูลได้!", "api-keys.json");
  }

  return keys.some((user: UserApiKey): boolean => user.key === key);
};

export const generateId = (length: number): string => {
  let id: string = "";
  const charsets: string[] = [
    ..."abcdefghijklmnopqrstuvwxyz",
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ..."0123456789",
  ];

  for (let i: number = 0; i < length; i++) {
    id += charsets[Math.floor(Math.random() * charsets.length)];
  }

  return id;
};

export const generateUserId = async (length: number = 40): Promise<string> => {
  const userId: string = generateId(length);

  if (await isUserExists(userId)) {
    return generateUserId(length);
  }

  return userId;
};

export const generateApiKey = async (length: number = 100): Promise<string> => {
  const apiKey: string = generateId(length);

  if (await isApiKeyExists(apiKey)) {
    return generateApiKey(length);
  }

  return apiKey;
};

export const getUserbyId = async (
  userId: string
): Promise<UserModel | null> => {
  const users: Users | null = await DataReader.readAllData<Users>("users.json");

  if (!users) {
    throw new FileNotFoundError("ไม่สามารถเปิดอ่านข้อมูลได้!", "users.json");
  }

  for (const user of users) {
    if (userId === user.userId) {
      return user;
    }
  }

  return null;
};

export const getUserbyUsernameAndPassword = async (
  userParam: UserLogin
): Promise<UserModel | null> => {
  const users: Users | null = await DataReader.readAllData<Users>("users.json");

  if (!users) {
    throw new FileNotFoundError("ไม่สามารถเปิดอ่านข้อมูลได้!", "users.json");
  }

  for (const user of users) {
    if (
      (userParam.username === user.username ||
        userParam.email === user.email) &&
      (await bcrypt.compare(userParam.password, user.password))
    ) {
      return user;
    }
  }

  return null;
};

export const getToken = (authorization: string | undefined): string => {
  if (!authorization && !authorization?.startsWith("Bearer ")) {
    throw new Error("token ไม่ถูกต้อง!");
  }

  return authorization.replace("Bearer ", "");
};
