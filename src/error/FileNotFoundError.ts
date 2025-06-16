import { DataFiles } from "../types/types.js";

export default class FileNotFoundError extends Error {
  public constructor(public message: string, public filename: DataFiles) {
    super(message);
  }

  public getMessage(): string {
    return this.message;
  }

  public getFilename(): DataFiles {
    return this.filename;
  }

  public getTemplateMessage(): string {
    return `ไม่พบไฟล์หรือเปิดอ่านไฟล์ข้อมูล '${this.filename}' ได้!`;
  }
}
