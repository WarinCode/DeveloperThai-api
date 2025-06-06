import fs, { constants } from "fs/promises";
import path from "path"
import { __dirname } from "../../data/data-path.js";

export default class FileManager {
  protected static getPath(): string {
    return path.join(__dirname, "books.json");
  }

  protected static async accessible(): Promise<boolean> {
    try {
      await fs.access(this.getPath(), constants.W_OK | constants.R_OK);
      return true;
    } catch (e: any) {
      console.error(e);
      return false;
    }
  }
}


