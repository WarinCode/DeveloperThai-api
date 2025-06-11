import bcrypt from "bcrypt";
import { getDataPath, getStaticPath, testing } from "../utils/index.js";
import Reader from "../utils/classes/Reader.js";
import BookSchema from "../types/schemas/book.js";
import { getRootPath, generateUserId } from "../utils/index.js";

testing(async () => {
    console.log(await Reader.readAllData());
}, false);

testing(() => {
    console.log(BookSchema.parse({
        bookName: "df",
        imageUrl: "http://image",
        author: null,
        isbn: 1234444,
        price: 34,
        pageCount: null,
        tableofContents: []
    }))
}, false);

testing(() => {
    console.log(getRootPath());
    console.log(getStaticPath());
    console.log(getDataPath());
}, false);

testing(async () => {
    for (let i: number = 1; i <= 10; i++) {
        console.log(i, await generateUserId());
    }
}, false);

testing(async () => {
    const password = "12345678";
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(password);
    console.log(hashPassword);
    console.log(await bcrypt.compare(password, hashPassword));
}, false);