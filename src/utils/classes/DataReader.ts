import fs from "fs/promises";
import { BookModel, Books } from "../../types/models/book.js";
import FileManager from "./FileManager.js";
import { Users } from "../../types/models/user.js";
import { DataFiles } from "../../types/types.js";
import { UserApiKeys } from "../../types/models/userApiKey.js";
import FileNotFoundError from "../../error/FileNotFoundError.js";

export default class DataReader extends FileManager {
  public static async readAllData<T extends Books | Users | UserApiKeys>(
    filename: DataFiles
  ): Promise<T | null> {
    try {
      if (await this.accessible(filename)) {
        const text: string = await fs.readFile(this.getPath(filename), {
          encoding: "utf8",
        });
        const data: T = JSON.parse(text);
        return data;
      }

      throw new FileNotFoundError("ไม่สามารถเปิดอ่านไฟล์ข้อมูลได้!", filename);
    } catch (e: unknown) {
      if (e instanceof FileNotFoundError) {
        console.error(e.getTemplateMessage());
      }

      return null;
    }
  }

  public static async readBookData(
    isbn: number
  ): Promise<BookModel | null | undefined> {
    try {
      const books: Books | null = await this.readAllData<Books>("books.json");

      if (!books || books.length === 0) {
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
