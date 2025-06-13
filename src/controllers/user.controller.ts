import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserSchema from "../types/schemas/user.js";
import DataWriter from "../utils/classes/DataWriter.js";
import DataReader from "../utils/classes/DataReader.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { UserParams, EnvironmentVariables } from "../types/types.js";
import { responseError, generateUserId, isUserExists, getUserbyUsernameAndPassword, getToken } from "../utils/index.js";
import { UserModel, Users, UserLogin } from "../types/models/user.js";
import * as UserPropertySchema from "../types/schemas/user.js";
import HttpResponseError from "../error/HttpResponseError.js";

export default class UserController {
    public async signIn({ body, headers: { authorization } }: Request<any, UserLogin, UserLogin>, res: Response): Promise<void> {
        if (AuthMiddleware.isAuthorized(authorization)) {
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

    public async signUp({ body }: Request<any, UserModel, UserModel>, res: Response): Promise<void> {
        const userData: UserModel = body;

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
            if (AuthMiddleware.isAuthorized(authorization)) {
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
            if (!AuthMiddleware.isAuthorized(authorization)) {
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
            if (!AuthMiddleware.isAuthorized(authorization)) {
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

    public async createApiKey(req: Request, res: Response): Promise<void> {
        try {
            res.send("dfgtd");
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