import { Request, Response } from "express";
import { responseError } from "../utils/index.js";
import DataReader from "../utils/classes/DataReader.js";
import DataWriter from "../utils/classes/DataWriter.js";
import BookValidator from "../utils/classes/BookValidator.js";
import { Books, BookModel } from "../types/models/book.js";
import { BookParams, QueryParams, ReqBody, ResBody } from "../types/types.js";
import BookSchema, * as BookPropertySchema from "../types/schemas/book.js";

export default class BookController {
  public sendHelloWorld(req: Request, res: Response): void {
    res.send("Hello World!");
  }

  public async getBooks(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const books: Books | null = await DataReader.readAllData<Books>();

      if (books === null) {
        throw new Error("ไม่มีรายการข้อมูลหนังสือใดๆ!");
      }
      res.status(200).type("json").json(books);
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async getBook(
    { params }: Request<BookParams>,
    res: Response
  ): Promise<void> {
    try {
      const book: BookModel | null | undefined = await DataReader.readBookData(
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
    res: Response
  ): Promise<void> {
    try {
      const books: Books | null = await DataReader.readAllData<Books>();

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
    res: Response
  ) {
    try {
      const books: Books | null = await DataReader.readAllData<Books>();

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
      await DataWriter.writeFile(JSON.stringify(books, null, 4));

      res.status(201).json({ message: "เพิ่มหนังสือใหม่สำเร็จ" });
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async update(
    { params: { isbn }, body }: Request<BookParams, ResBody, ReqBody>,
    res: Response
  ) {
    try {
      const books: Books | null = await DataReader.readAllData<Books>();

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

        await DataWriter.writeFile(JSON.stringify(books2, null, 4));
        res.status(200).json({ message: "แก้ไขข้อมูลหนังสือสำเร็จ" });

        return;
      }

      throw new Error("ไม่พบข้อมูลหนังสือที่ต้องการจะอัปเดต!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async delete(
    { params: { isbn } }: Request<BookParams>,
    res: Response
  ) {
    try {
      const books: Books | null = await DataReader.readAllData<Books>();

      if (books === null) {
        throw new Error("ไม่สามารถสร้างหนังสือใหม่แล้วเพิ่มข้อมูลเข้าไปได้!");
      }

      if (await BookValidator.isIsbnExists(parseInt(isbn))) {
        const books2 = books.filter(
          (book: BookModel) => book.isbn !== parseInt(isbn)
        );

        await DataWriter.writeFile(JSON.stringify(books2, null, 4));
        res.status(200).json({ message: "ลบหนังสือใหม่สำเร็จ" });

        return;
      }

      throw new Error("ไม่พบข้อมูลหนังสือที่ต้องการจะลบ!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updateBookName({ params, body: { bookName } }: Request<BookParams, Pick<BookModel, "bookName">, Pick<BookModel, "bookName">>, res: Response): Promise<void> {
    const isbn: number = parseInt(params.isbn);

    try {
      if (await BookValidator.isIsbnExists(isbn)) {
        BookPropertySchema.bookName.parse(bookName);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === isbn) {
            book.bookName = bookName;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขชื่อหนังสือเรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updateImage({ params, body: { imageUrl } }: Request<BookParams, Pick<BookModel, "imageUrl">, Pick<BookModel, "imageUrl">>, res: Response): Promise<void> {
    const isbn: number = parseInt(params.isbn);

    try {
      if (await BookValidator.isIsbnExists(isbn)) {
        BookPropertySchema.imageUrl.parse(imageUrl);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === isbn) {
            book.imageUrl = imageUrl;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขรูปภาพหนังสือเรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updateAuthor({ params, body: { author } }: Request<BookParams, Pick<BookModel, "author">, Pick<BookModel, "author">>, res: Response): Promise<void> {
    const isbn: number = parseInt(params.isbn);

    try {
      if (await BookValidator.isIsbnExists(isbn)) {
        BookPropertySchema.author.parse(author);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === isbn) {
            book.author = author;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขชื่อผู้แต่งเรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updateIsbn({ params, body }: Request<BookParams, Pick<BookModel, "isbn">, Pick<BookModel, "isbn">>, res: Response): Promise<void> {
    const oldIsbn: number = parseInt(params.isbn);
    const newIsbn: number = body.isbn;

    try {
      if (await BookValidator.isIsbnExists(oldIsbn)) {
        BookPropertySchema.isbn.parse(newIsbn);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === oldIsbn) {
            book.isbn = newIsbn;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขหมายเลข isbn เรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updatePrice({ params, body: { price } }: Request<BookParams, Pick<BookModel, "price">, Pick<BookModel, "price">>, res: Response): Promise<void> {
    const isbn: number = parseInt(params.isbn);

    try {
      if (await BookValidator.isIsbnExists(isbn)) {
        BookPropertySchema.price.parse(price);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === isbn) {
            book.price = price;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขราคาหนังสือเรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updatePageCount({ params, body: { pageCount } }: Request<BookParams, Pick<BookModel, "pageCount">, Pick<BookModel, "pageCount">>, res: Response): Promise<void> {
    const isbn: number = parseInt(params.isbn);

    try {
      if (await BookValidator.isIsbnExists(isbn)) {
        BookPropertySchema.pageCount.parse(pageCount);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === isbn) {
            book.pageCount = pageCount;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขจำนวนหน้าหนังสือเรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }

  public async updateTableofContents({ params, body: { tableofContents } }: Request<BookParams, Pick<BookModel, "tableofContents">, Pick<BookModel, "tableofContents">>, res: Response): Promise<void> {
    const isbn: number = parseInt(params.isbn);

    try {
      if (await BookValidator.isIsbnExists(isbn)) {
        BookPropertySchema.tableofContents.parse(tableofContents);

        const books: Books = <Books>await DataReader.readAllData<Books>();
        const updatedBooks: Books = books.map((book: BookModel): BookModel => {
          if (book.isbn === isbn) {
            book.tableofContents = tableofContents;
          }

          return book;
        });

        await DataWriter.writeFile(JSON.stringify(updatedBooks, null, 4));
        res.type("json").status(200).json({ message: "แก้ไขสารบัญหนังสือเรียบร้อย" });
        return;
      };

      throw new Error("ไม่สามารถทำการแก้ไขข้อมูลหนังสือได้!");
    } catch (e: unknown) {
      responseError(res, e);
    }
  }
}
