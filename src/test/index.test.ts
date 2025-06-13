import bcrypt from "bcrypt";
import { getDataPath, getStaticPath, testing } from "../utils/index.js";
import DataReader from "../utils/classes/DataReader.js";
import BookSchema from "../types/schemas/book.js";
import { getRootPath, generateUserId } from "../utils/index.js";
import jwt from "jsonwebtoken";

testing(async () => {
    console.log(await DataReader.readAllData());
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

testing(() => {
    const date = new Date();
    const date2 = new Date();
    date2.setDate(date.getDate() + 10);
    
    console.log('วันนี้', date.toDateString());
    console.log('วันพรุ่งนี้', date2.toDateString());

    console.log(date2 > date)
}, false);

testing(() => {
    const payload = { username: "john", password: "1234" };
    const key = "reivgferdgdf";
    const token = jwt.sign(payload, key, { expiresIn: "10s" });
    console.log("token", token);

    setTimeout(() => {
        jwt.verify(token, key, (err, decoded) => {
            console.log(err);
            console.log(decoded)
        })
    }, 5 * 1000);

        setTimeout(() => {
        jwt.verify(token, key, (err, decoded) => {
            console.log(err);
            console.log(decoded)
        })
    }, 12 * 1000);
}, false);