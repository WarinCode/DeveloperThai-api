import { Request, Response, NextFunction } from "express";
import { responseError } from "../utils/index.js";
import Reader from "../utils/classes/Reader.js";
import Writer from "../utils/classes/Writer.js";
import BookValidator from "../utils/classes/BookValidator.js";
import { Books, BookModel } from "../types/models/book.js";
import { Params, QueryParams, ReqBody, ResBody } from "../types/types.js";
import BookSchema from "../types/schemas/book.js";

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
      const books: Books | null = await Reader.readAllData<Books>();

      if (books === null) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }
      res.status(200).type("json").json(books);
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async getBook(
    { params }: Request<Params>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const book: BookModel | null | undefined = await Reader.readBookData(
        parseInt(params.isbn)
      );

      if (!book) {
        throw new Error("ไม่มีข้อมูลหนังสือที่ท่านเรียกหา!");
      }

      res.status(200).type("json").json(book);
    } catch (e: unknown) {
      responseError(res, e, 400);
    }
  }

  public async search(
    { query: { keyword } }: Request<any, any, any, QueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const books: Books | null = await Reader.readAllData<Books>();

      if (books === null || !keyword) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }

      const results: Books = books.filter((book: BookModel): boolean =>
        book.bookName.trim().toLowerCase().includes(keyword.trim().toLowerCase())
      );

      if (!results.length) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }

      res.status(200).type("json").json(results);
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async create(
    { body }: Request<any, ResBody, ReqBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const books: Books | null = await Reader.readAllData<Books>();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      BookSchema.parse(body);
      BookValidator.checkPropertyName(body);

      if (await BookValidator.isIsbnExists(body.isbn)) {
        throw new Error("มีเลข isbn นี้ซ้ำอยู่แล้วในข้อมูล!");
      }

      if (!(await BookValidator.checkIsbnLength(body.isbn))) {
        throw new Error("ความยาวของเลข isbn จะต้องมีความยาว 13 หลักเท่านั้น!");
      }

      books.push(body);
      await Writer.writeFile(JSON.stringify(books, null, 4));

      res.status(201).json({ message: "เพิ่มหนังสือใหม่สำเร็จ" });
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async update(
    { params: { isbn }, body }: Request<Params, ResBody, ReqBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const books: Books | null = await Reader.readAllData<Books>();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      BookSchema.parse(body);
      BookValidator.checkPropertyName(body);

      if (await BookValidator.isIsbnExists(parseInt(isbn))) {
        const books2: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === parseInt(isbn)) {
            book = body;
          }
          return book;
        });

        await Writer.writeFile(JSON.stringify(books2, null, 4));
        res.status(200).json({ message: "อัปเดตข้อมูลหนังสือสำเร็จ" });

        return;
      }

      throw new Error("ไม่พบข้อมูลหนังสือที่ต้องการจะอัปเดต!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async delete(
    { params: { isbn } }: Request<Params>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const books: Books | null = await Reader.readAllData<Books>();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      if (await BookValidator.isIsbnExists(parseInt(isbn))) {
        const books2 = books.filter(
          (book: BookModel) => book.isbn !== parseInt(isbn)
        );

        await Writer.writeFile(JSON.stringify(books2, null, 4));
        res.status(200).json({ message: "ลบหนังสือใหม่สำเร็จ" });

        return;
      }

      throw new Error("ไม่พบข้อมูลหนังสือที่ต้องการจะลบ!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async pageNotFound(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    responseError(res, new Error("ไม่พบหน้าเพจที่เรียกหา!"), 404);
  }
}
