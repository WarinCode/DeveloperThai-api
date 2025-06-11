import fs from "fs/promises";
import FileManager from "./FileManager.js";

export default class Writer extends FileManager {
  public static async writeFile(data: string): Promise<void> {
    try {
      if (await this.accessible()) {
        await fs.writeFile(this.getPath(), data, { encoding: "utf8" });
      } else {
        throw new Error("ไม่สามารถเขียนไฟล์ข้อมูลได้!");
      }
    } catch (e: any) {
      console.error(e);
    }
  }
}
