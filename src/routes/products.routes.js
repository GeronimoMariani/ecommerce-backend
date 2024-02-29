import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pId", getProductById);
productsRouter.post("/", createProduct);
productsRouter.put("/:pId", updateProduct);
productsRouter.delete("/:pId", deleteProduct);

export default productsRouter;