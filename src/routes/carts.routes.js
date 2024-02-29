import { Router } from "express";
import { addProductToCart, createCart, deleteProductInCart, getCartById, getCarts, updateCart, updateProductInCart } from "../controllers/carts.controller.js";

const cartsRouter = Router();

cartsRouter.get("/", getCarts);
cartsRouter.get("/:cId", getCartById);
cartsRouter.post("/", createCart);
cartsRouter.post("/:cId/product/:pId", addProductToCart);
cartsRouter.put("/:cId", updateCart);
cartsRouter.put("/:cId/product/:pId", updateProductInCart);
cartsRouter.delete("/:cId/product/:pId", deleteProductInCart);

export default cartsRouter;