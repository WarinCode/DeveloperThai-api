import { Router } from "express";
import BookController from "../controllers/book.controller.js";

const bookRoutes: Router = Router();
const bookController: BookController = new BookController();

bookRoutes.get("/api/books", bookController.getBooks)
    .get("/api/books/search", bookController.search) // /api/books/search/?keyword=:keyword
    .get("/api/books/:isbn", bookController.getBook)
    .post("/api/books/create", bookController.create)
    .put("/api/books/update/:isbn", bookController.update)
    .delete("/api/books/delete/:isbn", bookController.delete)
    .patch("/api/books/update/:isbn/bookname", bookController.updateBookName)
    .patch("/api/books/update/:isbn/isbn", bookController.updateIsbn)
    .patch("/api/books/update/:isbn/image", bookController.updateImage)
    .patch("/api/books/update/:isbn/author", bookController.updateAuthor)
    .patch("/api/books/update/:isbn/price", bookController.updatePrice)
    .patch("/api/books/update/:isbn/page-count", bookController.updatePageCount)
    .patch("/api/books/update/:isbn/table-of-contents", bookController.updateTableofContents)

export default bookRoutes;