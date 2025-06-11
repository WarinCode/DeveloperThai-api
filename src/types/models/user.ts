import { z } from "zod";
import UserSchema from "../schemas/user.js";

export type UserModel = z.infer<typeof UserSchema>;
export type Users = UserModel[];