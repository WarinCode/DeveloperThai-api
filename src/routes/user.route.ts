import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const userRoutes: Router = Router();
const userController: UserController = new UserController();

userRoutes.get("/api/user/data", userController.getUserData)
    .put("/api/users/update/:userId", userController.updateUser)
    .patch("/api/users/update/:userId/password", userController.updatePassword)
    .delete("/api/users/delete/:userId", userController.deleteUserAccount)
    .post("/api/user/key", userController.createApiKey)

export default userRoutes;