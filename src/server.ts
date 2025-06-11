import express, { Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { EnvironmentVariables } from "./types/types.js";
import BookController from "./controllers/book.controller.js";

// สร้าง object ชื่อ app
const app: Express = express();

// อ่านค่าตัวแปรในไฟล์ .env แล้วกำหนดค่าหมายเลข port
dotenv.config();
const port: number = parseInt((<EnvironmentVariables>process.env).PORT) ?? 3000;
const bookController: BookController = new BookController();

// ใช้ middlewares
app
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(morgan("dev"))
  .use(cors());

// กำหนดเส้น api endpoints ทั้งหมด
app
  .get("/", bookController.sendHelloWorld)
  .get("/api/books", bookController.getBooks)
  .get("/api/books/search", bookController.search) // /api/books/search/?keyword=:keyword
  .get("/api/books/:isbn", bookController.getBook)
  .post("/api/create", bookController.create)
  .put("/api/update/:isbn", bookController.update)
  .delete("/api/delete/:isbn", bookController.delete)
  .all("*", bookController.pageNotFound)
  .listen(port, (): void => console.log(`Server is running on port: ${port}`));
