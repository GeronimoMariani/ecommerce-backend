import { Router } from "express";
import { addProductToCart, createCart, deleteProductInCart, getCartById, getCarts, purchaseCart, updateCart, updateProductInCart } from "../controllers/carts.controller.js";
import { authorizeUser } from "../middlewares/auth.js";

const cartsRouter = Router();

cartsRouter.get("/", getCarts);
cartsRouter.get("/:cId", getCartById);
cartsRouter.post("/", createCart);
cartsRouter.post("/:cId/product/:pId", authorizeUser, addProductToCart);
cartsRouter.put("/:cId", updateCart);
cartsRouter.put("/:cId/product/:pId", updateProductInCart);
cartsRouter.delete("/:cId/product/:pId", deleteProductInCart);
cartsRouter.post("/:cId/purchase", purchaseCart);

export default cartsRouter;