import { z } from "zod";

const BookSchema = z.object({
    bookName: z.string().min(2).max(100),
    imageUrl: z.string().url().nullable(),
    author: z.string().min(2).max(30).nullable(),
    isbn: z.number().positive(),
    price: z.number().positive(),
    pageCount: z.number().positive().nullable(),
    tableofContents: z.array(z.string()).nullable()
});

export default BookSchema;