import { z } from "zod";
import UserApiKeySchema from "../schemas/userApiKey.js";

export type UserApiKey = z.infer<typeof UserApiKeySchema>;
export type UserApiKeys = UserApiKey[];