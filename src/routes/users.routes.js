import { Router } from "express";
import { deleteExpiredUser, deleteUser, documents, getUsers, rolePremium, roles } from "../controllers/users.controller.js";
import { uploader } from "../utils/multer.js";

const usersRouter = Router();

usersRouter.get("/premium/:uid", rolePremium);
usersRouter.post("/:uid/documents", uploader.fields([{ name: 'profile_image', maxCount: 1}, { name: 'product_image', maxCount: 1}, { name: 'documents', maxCount: 3}]), documents);
usersRouter.get("/", getUsers);
usersRouter.delete("/", deleteExpiredUser);
usersRouter.post("/roles/:id", roles);
usersRouter.delete("/:id", deleteUser);

export default usersRouter;