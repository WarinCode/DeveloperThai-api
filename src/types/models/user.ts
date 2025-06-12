import { z } from "zod";
import UserSchema from "../schemas/user.js";

export type UserModel = z.infer<typeof UserSchema>;
export type Users = UserModel[];
export type UserLogin = Omit<UserModel, "userId">;