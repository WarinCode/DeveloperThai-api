import { z } from "zod";

const UserSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8).max(100),
    userId: z.string().optional(),
    email: z.string().email()
});

export default UserSchema;