import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserSchema from "../types/schemas/user.js";
import Writer from "../utils/classes/Writer.js";
import Reader from "../utils/classes/Reader.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { UserParams, EnvironmentVariables } from "../types/types.js";
import { responseError, generateUserId, isUserExists, getUserbyUsernameAndPassword, getUserbyId } from "../utils/index.js";
import { UserModel, Users, UserLogin } from "../types/models/user.js";
import * as UserPropertySchema from "../types/schemas/user.js";

export default class UserController {
    public async signIn({ body, headers: { authorization } }: Request<any, UserLogin, UserLogin>, res: Response): Promise<void> {
        if (authorization) {
            const result: boolean = await AuthMiddleware.isAuthorized(authorization);

            if (result) {
                res.type("json").status(200).json({ message: "login สำเร็จ" });
                return;
            }
        }

        const secretKey: string = (<EnvironmentVariables>process.env).SECRET_KEY;
        const validateUser: UserLogin = body;

        try {
            const user: UserModel | null = await getUserbyUsernameAndPassword(validateUser);

            if (!user) {
                throw new Error("login ล้มเหลว ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
            }

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
            userData.userId = await generateUserId();
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

            res.status(201).type("json").json({ message: "สมัครบัญชีสำเร็จแล้ว" });
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public getUserData({ headers: { authorization } }: Request, res: Response): void {
        try {
            const token: string = (<string>authorization).replace("Bearer ", "");
            const decoded: UserModel & JwtPayload = <UserModel & JwtPayload>jwt.decode(token);
            res.type("json").status(200).json(decoded);
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async deleteUserAccount({ headers: { authorization }, params: { userId } }: Request<UserParams>, res: Response): Promise<void> {
        try {
            if (authorization) {
                const result: boolean = await AuthMiddleware.isAuthorized(authorization);

                if (result) {
                    const user: UserModel | null = await getUserbyId(userId);

                    if (user) {
                        const users: Users = <Users>await Reader.readAllData<Users>("users.json");
                        const filteredUsers: Users = users.filter((u: UserModel): boolean => u.userId !== userId);
                        await Writer.writeFile(JSON.stringify(filteredUsers, null, 4), "users.json");

                        res.type("json").status(200).json({ message: "ลบบัญชีผู้ใช้งานสำเร็จ" });
                        return;
                    }
                }
            }

            throw new Error("เกิดข้อผิดพลาดลางอย่างเกิดขึ้น!");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async updateUser(req: Request<UserParams>, res: Response): Promise<void> {
        try {
            res.send("ok");
        } catch (e: unknown) {
            responseError(res, e);
        }
    }

    public async updatePassword(req: Request<UserParams>, res: Response): Promise<void> {
        try {
            res.send("ok");
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