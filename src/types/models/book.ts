import { z } from "zod";
import BookSchema from "../schemas/book.js";

export type BookModel = z.infer<typeof BookSchema>;
export type Books = BookModel[];