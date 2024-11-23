import express, { Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { EnvironmentVariables } from "./types/types.js";
import BookController from "./controllers/book.controller.js";

// สร้าง server แล้วกำหนดหมายเลข port ของ server
const app: Express = express();

// อ่านค่าตัวแปรใน env แล้วกำหนดหมายเลข port
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
  .get("/api/book/isbn=:isbn", bookController.getBook)
  .get("/api/book/:id", bookController.getBook)
  .get("/api/search/", bookController.search) // /api/book/search/?keyword=:keyword
  .post("/api/create", bookController.create)
  .put("/api/update/:id", bookController.update)
  .delete("/api/delete/:id", bookController.delete)
  .all("*", bookController.pageNotFound)
  .listen(port, (): void => console.log(`Server is running on port: ${port}`));