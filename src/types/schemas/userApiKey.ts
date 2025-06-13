import { z } from "zod";

export const username = z.string().min(3).max(30);
export const key = z.string().length(100);
export const isActiveKey = z.boolean();
export const createdAt = z.date();
export const expiresIn = z.date();

const UserApiKeySchema = z.object({
  username,
  key,
  isActiveKey,
  createdAt,
  expiresIn
});

export default UserApiKeySchema;