import fs from "fs/promises";
import { BookModel, Books } from "../../types/models/book.js";
import FileManager from "./FileManager.js";
import { Users } from "../../types/models/user.js";

export default class Reader extends FileManager {
  public static async readAllData<T extends Books | Users>(filename: string = "books.json"): Promise<T | null> {
    try {
      if (await this.accessible()) {
        const text: string = await fs.readFile(this.getPath(filename), {
          encoding: "utf8",
        });
        const data: T = JSON.parse(text);
        return data;
      }

      throw new Error("ไม่สามารถเปิดอ่านไฟล์ข้อมูลได้!");
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }

  public static async readBookData(
    isbn: number
  ): Promise<BookModel | null | undefined> {
    try {
      const books: Books | null = await this.readAllData<Books>();

      if (books === null || books.length === 0) {
        return null;
      }

      const book: BookModel | undefined = books
        .filter((item: BookModel): boolean => item.isbn === isbn)
        .at(0);

      return book;
    } catch (e: unknown) {
      console.error(e);
      return null;
    }
  }
}