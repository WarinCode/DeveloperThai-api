import fs, { constants } from "fs/promises";

export default class FileManager {
  protected static getPath(defaultPath?: string): string {
    if(typeof defaultPath === "string"){
        return defaultPath.concat("\\src\\data\\books.json");
    }

    return process.cwd().concat("\\src\\data\\books.json");
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
