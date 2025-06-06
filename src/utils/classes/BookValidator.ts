import FileManager from "./FileManager.js";
import Reader from "./Reader.js";
import { BookModel, Books } from "../../types/model/book.js";

export default class BookValidator extends FileManager {
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

    public static async checkIsbnLength(isbn: number): Promise<boolean> {
        return String(isbn).length === 13;
    }

    public static async isKeyExists(key: keyof BookModel, data: Partial<BookModel>): Promise<boolean> {
        return key in data;
    }
}