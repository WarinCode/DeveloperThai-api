import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserSchema from "../types/schemas/user.js";
import Writer from "../utils/classes/Writer.js";
import Reader from "../utils/classes/Reader.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { EnvironmentVariables } from "../types/types.js";
import { responseError, generateUserId, isUserExists, getUserbyId } from "../utils/index.js";
import { UserModel, Users } from "../types/models/user.js";

export default class UserController {
    public async signIn({ body, headers: { authorization } }: Request<any, UserModel, UserModel>, res: Response): Promise<void> {
        if (authorization) {
            const result: boolean = await AuthMiddleware.isAuthorized(authorization);

            if (result) {
                res.type("json").status(200).json({ message: "login สำเร็จ" });
                return;
            }
        }

        const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;
        const validateUser: UserModel = body;

        try {
            if (!validateUser?.userId) {
                throw new Error("id ของผู้ใช้งานไม่ถูกต้อง!");
            }

            const user: UserModel = <UserModel>await getUserbyId(validateUser.userId);

            if (await bcrypt.compare(validateUser.password, user.password)) {
                const token: string = jwt.sign(user, secretKey, { algorithm: "HS512" });
                res.type("json").status(200).json({ message: "login สำเร็จ", token });
                return;
            }

            throw new Error("เกิดข้อผิดพลาดบางอย่างขึ้น!");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async signUp({ body }: Request<any, UserModel, UserModel>, res: Response): Promise<void> {
        const userData: UserModel = body;

        try {
            UserSchema.parse(userData);

            const hashPassword: string = await bcrypt.hash(userData.password, 10);
            const id: string = await generateUserId();
            userData.userId = id;
            userData.password = hashPassword;

            if (await isUserExists(userData)) {
                throw new Error("มีข้อมูลผู้ใช้งานนี้อยู่ในระบบอยู่แล้ว!");
            }

            const users = await Reader.readAllData<Users>("users.json");
            if (!users) {
                throw new Error("ไม่สามารถอ่านข้อมูล users ได้!");
            }
            users.push(userData);
            await Writer.writeFile(JSON.stringify(users, null, 4), "users.json");

            res.status(201).type("json").json({ message: "สมัครบัญชีสำเร็จแล้ว", userId: id });
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async getUserData({ headers: { authorization } }: Request, res: Response): Promise<void> {
        try {
            const token: string = (<string>authorization).replace("Bearer ", "");
            const decoded: UserModel & JwtPayload = <UserModel & JwtPayload>jwt.decode(token);
            res.type("json").status(200).json(decoded);
        } catch(e: unknown) {
            responseError(res, e);
        }
    }
}