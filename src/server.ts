import express, { Express, urlencoded, json } from "express";
import logger from "morgan";
import cors from "cors";
import compression from "compression";
import { configDotenv } from "dotenv";
import UserController from "./controllers/user.controller.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import ApiKeyMiddleware from "./middlewares/ApiKeyMiddleware.js";
import bookRoutes from "./routes/book.route.js";
import userRoutes from "./routes/user.route.js";
import { getStaticPath, getEnv } from "./utils/index.js";
import { corsOptions, dotenvOptions, limiter, compressionOptions } from "./configuration/index.js";

const app: Express = express();

configDotenv(dotenvOptions);
const port: number = getEnv("PORT") ? parseInt(<string>getEnv("PORT")) : 3000;
const userController: UserController = new UserController();

app
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(logger("dev"))
  .use(cors(corsOptions))
  .use(express.static(getStaticPath()))
  .use(limiter)
  .use(compression(compressionOptions))
  .use("/api/*", AuthMiddleware.authorization)
  .use("/api/books/*", ApiKeyMiddleware.validateKey);
app
  .get("/", userController.sendHelloWorld)
  .post("/sign-in", userController.signIn)
  .post("/sign-up", userController.signUp)
  .use(bookRoutes)
  .use(userRoutes)
  .all("*", userController.pageNotFound)
  .listen(port, (): void => console.log(`Server is running on port: ${port}`));
