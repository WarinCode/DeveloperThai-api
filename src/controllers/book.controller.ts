import { Request, Response, NextFunction } from "express";
import { responseError } from "../utils/index.js";
import Reader from "../utils/classes/Reader.js";
import Writer from "../utils/classes/Writer.js";
import { Books, BookModel } from "../types/model/book.js";
import { Params, QueryParams, ReqBody, ResBody } from "../types/types.js";

export default class BookController {
  public sendHelloWorld(req: Request, res: Response, next: NextFunction): void {
    res.send("Hello World!");
  }

  public async getBooks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const books: Books | null = await Reader.readAllData();

      if (books === null) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }
      res.status(200).type("json").json(books);
    } catch (e: any) {
      responseError(res, e);
    }
  }

  public async getBook(
    { params, url }: Request<Params>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const book: BookModel | null | undefined = await Reader.readData(
        parseInt(params.id ?? params.isbn)
      );

      if (!book) {
        res.status(400).send(`ไม่มีข้อมูลหนังสือที่ท่านเรียกหา!`);
        return;
      }

      res.status(200).type("json").json(book);
    } catch (e: any) {
      responseError(res, e);
    }
  }

  public async search(
    { query: { keyword } }: Request<any, any, any, QueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const books: Books | null = await Reader.readAllData();

      if (books === null || !keyword) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }

      const results: Books = books.filter((book: BookModel): boolean =>
        book.bookName.toLowerCase().includes(keyword.trim().toLowerCase())
      );

      if (!results.length) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }

      res.status(200).type("json").json(results);
    } catch (e) {
      responseError(res, e);
    }
  }

  public async create(
    { body }: Request<any, ResBody, ReqBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const books: Books | null = await Reader.readAllData();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      books.push(body);
      await Writer.writeFile(JSON.stringify(books, null, 4));

      res.status(201).json({ message: "เพิ่มหนังสือใหม่สำเร็จ" });
    } catch (e: any) {
      responseError(res, e);
    }
  }

  public async update(
    { params: { id }, body }: Request<Params, ResBody, ReqBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const books: Books | null = await Reader.readAllData();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      const books2: Books = books.map((book: BookModel): BookModel => {
        if (book.id === parseInt(id)) {
          book = body;
        }
        return book;
      });

      await Writer.writeFile(JSON.stringify(books2, null, 4));

      res.status(201).json({ message: "อัปเดตข้อมูลหนังสือสำเร็จ" });
    } catch (e: any) {
      responseError(res, e);
    }
  }

  public async delete(
    { params: { id } }: Request<Params>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const books: Books | null = await Reader.readAllData();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      const books2 = books.filter(
        (book: BookModel) => book.id !== parseInt(id)
      );
      await Writer.writeFile(JSON.stringify(books2, null, 4));

      res.status(201).json({ message: "ลบหนังสือใหม่สำเร็จ" });
    } catch (e: any) {
      responseError(res, e);
    }
  }

  public async pageNotFound(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.status(404).send("<h1>ไม่พบหน้าเพจที่เรียกหา!</h1>");
  }
}
