import FileManager from "./FileManager.js";
import Reader from "./Reader.js";
import { BookModel, Books } from "../../types/models/book.js";

export default class BookValidator extends FileManager {
    private static keys: string[] = ["bookName", "imageUrl", "author", "isbn", "price", "pageCount", "tableofContents"];

    public static async isIsbnExists(isbn: number): Promise<boolean> {
        if (await this.accessible()) {
            const books: Books = <Books>(await Reader.readAllData());

            for (const book of books) {
                if (book.isbn === isbn) {
                    return true;
                }
            }
        }

        return false;
    }

    public static checkIsbnLength(isbn: number): boolean {
        return String(isbn).length === 13;
    }

    public static isKeyExists(key: keyof BookModel, data: Partial<BookModel>): boolean {
        return key in data;
    }

    public static checkPropertyName(book: BookModel): void {
        for (const key in book) {
            if (!this.keys.includes(key)) {
                throw new Error(`ไม่มีชื่อ property '${key}' นี้อยู่ใน model หนังสือ!`);
            }
        }
    }
}