import fs from "fs/promises";
import FileManager from "./FileManager.js";
import { DataFiles } from "../../types/types.js";

export default class DataWriter extends FileManager {
  public static async writeFile(data: string, filename: DataFiles): Promise<void> {
    try {
      if (await this.accessible(filename)) {
        await fs.writeFile(this.getPath(filename), data, { encoding: "utf8" });
      } else {
        throw new Error("ไม่สามารถเขียนไฟล์ข้อมูลได้!");
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }
}
