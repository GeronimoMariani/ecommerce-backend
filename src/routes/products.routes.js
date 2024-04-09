import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, mockingProducts, updateProduct } from "../controllers/products.controller.js";
import { authorizeAdmin, authorizeAdminAndPremium } from "../middlewares/auth.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pId", getProductById);
productsRouter.post("/", authorizeAdminAndPremium, createProduct);
productsRouter.put("/:pId", authorizeAdmin, updateProduct);
productsRouter.delete("/:pId", authorizeAdminAndPremium, deleteProduct);
productsRouter.get("/mocking/mockingproducts", mockingProducts);

export default productsRouter;