import express, { Express, urlencoded, json } from "express";
import logger from "morgan";
import cors from "cors";
import { configDotenv } from "dotenv";
import { corsOptions, dotenvOptions, limiter } from "./configuration/index.js";
import BookController from "./controllers/book.controller.js";
import UserController from "./controllers/user.controller.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import { getStaticPath } from "./utils/index.js";
import { EnvironmentVariables } from "./types/types.js";

const app: Express = express();

configDotenv(dotenvOptions);
const port: number = parseInt((<EnvironmentVariables>process.env).PORT);
const bookController: BookController = new BookController();
const userController: UserController = new UserController();

app
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(logger("dev"))
  .use(cors(corsOptions))
  .use(express.static(getStaticPath()))
  .use(limiter)
  .use("/api/*", AuthMiddleware.authorization);

app
  .get("/", bookController.sendHelloWorld)
  .post("/sign-in", userController.signIn)
  .post("/sign-up", userController.signUp)
  .get("/api/books", bookController.getBooks)
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
  .get("/api/user/data", userController.getUserData)
  .put("/api/user/update/:userId", userController.updateUser)
  .patch("/api/user/update/:userId/password", userController.updatePassword)
  .delete("/api/user/delete/:userId", userController.deleteUserAccount)
  .all("*", userController.pageNotFound)
  .listen(port, (): void => console.log(`Server is running on port: ${port}`));
