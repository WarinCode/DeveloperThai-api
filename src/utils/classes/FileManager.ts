import fs, { constants } from "fs/promises";
import { getDataPath } from "../index.js";
import { DataFiles } from "../../types/types.js";

export default class FileManager {
  protected static getPath(filename: DataFiles): string {
    return getDataPath(filename);
  }

  protected static async accessible(filename: DataFiles): Promise<boolean> {
    try {
      await fs.access(this.getPath(filename), constants.W_OK | constants.R_OK);
      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }
}


