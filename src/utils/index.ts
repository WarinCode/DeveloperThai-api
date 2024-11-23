import { Response } from "express";
import fs, { constants } from "fs/promises";
import { BookModel, Books } from "../types/model/book.js";

export function getDataPath(): string {
  return process.cwd().concat("\\src\\data\\books.json");
}

export async function accessible(): Promise<boolean> {
  try {
    await fs.access(getDataPath(), constants.W_OK | constants.R_OK);
    return true;
  } catch (e: any) {
    console.error(e);
    return false;
  }
}

export async function readAll(): Promise<Books | null> {
  try {
    if (await accessible()) {
      const text: string = await fs.readFile(getDataPath(), {
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

export async function read(n: number): Promise<BookModel | null | undefined> {
  try {
    const books: Books | null = await readAll();

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

export function responseError(res: Response, e: any | Error) {
  if (e instanceof Error) {
    console.error(e.message);
    res.status(500).json({
      message: e.message,
    });
  }
}

export async function writeFile(data: string): Promise<void> {
  try {
    if (await accessible()) {
      await fs.writeFile(getDataPath(), data, { encoding: "utf8" });
    } else {
      throw new Error("ไม่สามารถเขียนไฟล์ข้อมูลได้!");
    }
  } catch (e: any) {
    console.error(e);
  }
}
