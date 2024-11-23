import fs from "fs/promises";
import { BookModel, Books } from "../../types/model/book.js";
import FileManager from "./FileManager.js";

export default class Reader extends FileManager {
  public static async readAllData(): Promise<Books | null> {
    try {
      if (await this.accessible()) {
        const text: string = await fs.readFile(this.getPath(), {
          encoding: "utf8",
        });
        const books: Books = JSON.parse(text);
        return books;
      }

      throw new Error("ไม่สามารถเปิดอ่านไฟล์ข้อมูลได้!");
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }

  public static async readData(
    n: number
  ): Promise<BookModel | null | undefined> {
    try {
      const books: Books | null = await this.readAllData();

      if (books === null || books.length === 0) {
        return null;
      }

      const book: BookModel | undefined = books
        .filter((item: BookModel): boolean => item.id === n || item.isbn === n)
        .at(0);

      return book;
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }
}
