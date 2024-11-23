import { Request, Response, NextFunction } from "express";
import { responseError } from "../utils/index.js";
import { Books, BookModel } from "../types/model/book.js";
import { Params, QueryParams, ReqBody, ResBody } from "../types/types.js";
import BookProvider from "../data/data.js";

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
      res.status(200).type("json").json(BookProvider.getBooks());
    } catch (e: any) {
      responseError(res, e);
    }
  }

  public async getBook(
    { params: { id, isbn }, url }: Request<Params>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const book: BookModel | undefined = BookProvider.getBooks()
        .filter(
          (item: BookModel): boolean =>
            item.id === parseInt(id) || item.isbn === parseInt(isbn)
        )
        .at(0);

      if (!book) {
        throw new Error("ไม่มีข้อมูลหนังสือที่ท่านเรียกหา!");
      }

      res.status(200).type("json").json(book);
    } catch (e: any) {
      responseError(res, e, 400);
    }
  }

  public async search(
    { query: { keyword } }: Request<any, any, any, QueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const results: Books = BookProvider.getBooks().filter(
        (book: BookModel): boolean =>
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
      BookProvider.addBook(body);
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
      BookProvider.updateBook(parseInt(id), body);
      res.status(200).json({ message: "อัปเดตข้อมูลหนังสือสำเร็จ" });
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
      BookProvider.deleteBook(parseInt(id));
      res.status(200).json({ message: "ลบหนังสือใหม่สำเร็จ" });
    } catch (e: any) {
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
