import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserSchema from "../types/schemas/user.js";
import DataWriter from "../utils/classes/DataWriter.js";
import DataReader from "../utils/classes/DataReader.js";
import { UserParams, EnvironmentVariables } from "../types/types.js";
import { responseError, generateUserId, isUserExists, getUserbyUsernameAndPassword, getToken, generateApiKey } from "../utils/index.js";
import { UserModel, Users, UserLogin } from "../types/models/user.js";
import * as UserPropertySchema from "../types/schemas/user.js";
import HttpResponseError from "../error/HttpResponseError.js";
import { UserApiKey, UserApiKeys } from "../types/models/userApiKey.js";
import FileNotFoundError from "../error/FileNotFoundError.js";
import { isAuthorized } from "../utils/index.js";

export default class UserController {
    public sendHelloWorld(req: Request, res: Response): void {
        res.send("Hello World!");
    }

    public async signIn({ body, headers: { authorization } }: Request<any, UserLogin, UserLogin>, res: Response): Promise<void> {
        if (isAuthorized(authorization)) {
            res.type("json").status(200).json({ message: "login สำเร็จ" });
            return;
        }

        const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;
        const validateUser: UserLogin = body;

        try {
            const user: UserModel | null = await getUserbyUsernameAndPassword(validateUser);

            if (!user) {
                throw new HttpResponseError("login ล้มเหลว ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง", 403);
            }

            if (await bcrypt.compare(validateUser.password, user.password)) {
                const token: string = jwt.sign(user, secretKey, { algorithm: "HS512" });
                res.type("json").status(200).json({ message: "login สำเร็จ", token });
                return;
            }

            throw new HttpResponseError("เกิดข้อผิดพลาดบางอย่างขึ้น!");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async signUp({ body }: Request<any, UserLogin, UserLogin>, res: Response): Promise<void> {
        const userData: UserModel = { ...body, userId: "" };

        try {
            UserSchema.parse(userData);

            const hashPassword: string = await bcrypt.hash(userData.password, 10);
            userData.userId = await generateUserId();
            userData.password = hashPassword;

            if (await isUserExists(userData)) {
                throw new HttpResponseError("มีข้อมูลผู้ใช้งานนี้อยู่ในระบบอยู่แล้ว!");
            }

            const users: Users | null = await DataReader.readAllData<Users>("users.json");
            if (!users) {
                throw new HttpResponseError("ไม่สามารถอ่านข้อมูล users ได้!");
            }
            users.push(userData);
            await DataWriter.writeFile(JSON.stringify(users, null, 4), "users.json");

            res.status(201).type("json").json({ message: "สมัครบัญชีสำเร็จแล้ว" });
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public getUserData({ headers: { authorization } }: Request, res: Response): void {
        try {
            const token: string = getToken(authorization);
            const decoded: UserModel & JwtPayload = <UserModel & JwtPayload>jwt.decode(token);
            res.type("json").status(200).json(decoded);
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async deleteUserAccount({ headers: { authorization }, params: { userId } }: Request<UserParams>, res: Response): Promise<void> {
        try {
            if (isAuthorized(authorization)) {
                if (!(await isUserExists(userId))) {
                    throw new HttpResponseError("รหัส id ของผู้ใช้งานไม่ถูกต้อง!", 403);
                }

                const users: Users = <Users>await DataReader.readAllData<Users>("users.json");
                const filteredUsers: Users = users.filter((user: UserModel): boolean => user.userId !== userId);
                await DataWriter.writeFile(JSON.stringify(filteredUsers, null, 4), "users.json");

                res.type("json").status(200).json({ message: "ลบบัญชีผู้ใช้งานสำเร็จ" });
                return;
            }

            throw new HttpResponseError("เกิดข้อผิดพลาดบางอย่างขึ้น!");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async updatePassword({ params: { userId }, body: { password }, headers: { authorization } }: Request<UserParams, Pick<UserModel, "password">, Pick<UserModel, "password">>, res: Response): Promise<void> {
        try {
            if (!isAuthorized(authorization)) {
                throw new HttpResponseError("ผู้ใช้งานยืนยันตัวตนไม่ถูกต้อง!", 403);
            }

            if (await isUserExists(userId)) {
                UserPropertySchema.password.parse(password);

                let newToken: string = "";
                const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;
                const hashPassword: string = await bcrypt.hash(password, 10);
                const users: Users = <Users>await DataReader.readAllData<Users>("users.json");
                const updatedUser: Users = users.map((user: UserModel): UserModel => {
                    if (user.userId === userId) {
                        user.password = hashPassword;
                        newToken = jwt.sign(user, secretKey, { algorithm: "HS512" });
                    }

                    return user;
                })
                await DataWriter.writeFile(JSON.stringify(updatedUser, null, 4), "users.json");

                res.type("json").status(200).json({ message: "แก้ไข password เรียบร้อย", newToken });
                return;
            }

            throw new HttpResponseError("รหัส id ผู้ใช้งานไม่ถูกต้อง!");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async updateUser({ body, params: { userId }, headers: { authorization } }: Request<UserParams, Omit<UserModel, "password">, Omit<UserModel, "password">>, res: Response): Promise<void> {
        try {
            if (!isAuthorized(authorization)) {
                throw new HttpResponseError("ผู้ใช้งานยืนยันตัวตนไม่ถูกต้อง!", 403);
            }

            if (await isUserExists(userId)) {
                UserPropertySchema.email.parse(body.email);
                UserPropertySchema.username.parse(body.username);

                if (await isUserExists({ ...body, password: "" })) {
                    throw new HttpResponseError("มีชื่อผู้ใช้งานหรืออีเมลใช้งานในระบบอยู่แล้ว!");
                }

                let newToken: string = "";
                const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;
                const users: Users = <Users>await DataReader.readAllData<Users>("users.json");
                const updatedUser: Users = users.map((user: UserModel): UserModel => {
                    if (user.userId === userId) {
                        user.username = body.username;
                        user.email = body.email;
                        newToken = jwt.sign(user, secretKey, { algorithm: "HS512" });
                    }
                    return user;
                })
                await DataWriter.writeFile(JSON.stringify(updatedUser, null, 4), "users.json");

                res.type("json").status(200).json({ message: "แก้ไขชื่อผู้ใช้งานและอีเมลเรียบร้อย", username: body.username, email: body.email, newToken });
                return;
            }

            throw new HttpResponseError("รหัส id ผู้ใช้งานไม่ถูกต้อง!");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async createApiKey({ headers: { authorization } }: Request, res: Response): Promise<void> {
        try {
            if (!isAuthorized(authorization)) {
                throw new HttpResponseError("ผู้ใช้งานยืนยันตัวตนไม่ถูกต้อง!", 403);
            }

            const token: string = getToken(authorization);
            const user: UserModel = <UserModel>jwt.decode(token);
            const apiKey: string = await generateApiKey();
            const currentDate = new Date();
            const expiryDate = new Date();
            expiryDate.setDate(currentDate.getDate() + 7);

            const users: UserApiKeys | null = await DataReader.readAllData<UserApiKeys>("api-keys.json");
            if (!users) {
                throw new FileNotFoundError("ไม่สามารถเปิดอ่านไฟล์ข้อมูลได้!", "api-keys.json");
            }

            const data: UserApiKey = {
                username: user.username,
                userId: user.userId,
                key: apiKey,
                isActiveKey: true,
                createdAt: currentDate,
                expiresIn: expiryDate
            }
            users.push(data);
            await DataWriter.writeFile(JSON.stringify(users, null, 4), "api-keys.json");

            res.type("json").status(201).json({ message: "สร้าง key สำเร็จ", apiKey });
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public pageNotFound(
        req: Request,
        res: Response
    ): void {
        responseError(res, new Error("ไม่พบหน้าเพจที่เรียกหา!"), 404);
    }
}