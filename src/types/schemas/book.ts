import { z } from "zod";

export const bookName = z.string().min(2).max(100);
export const imageUrl = z.string().url().nullable();
export const author = z.string().min(2).max(30).nullable();
export const isbn = z.number().positive();
export const price = z.number().positive();
export const pageCount = z.number().positive().nullable();
export const tableofContents = z.array(z.string()).nullable();

const BookSchema = z.object({ bookName, imageUrl, author, isbn, price, pageCount, tableofContents });
export default BookSchema;