import { z } from "zod";

export const username = z.string().min(3).max(30);
export const password = z.string().min(8).max(100);
export const userId = z.string();
export const email = z.string().email();

const UserSchema = z.object({ username, password, userId, email });
export default UserSchema;