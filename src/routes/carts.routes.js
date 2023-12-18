import { Router } from "express";
import CartManager from "../utils/cartsManager.js";

const cartsRouter = Router();
const cartManager = new CartManager("src/data/carts.json");

cartsRouter.get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send(carts);
});

cartsRouter.get("/:cId", async (req, res) => {
    const { cId } = req.params;
    const cartById = await cartManager.getCartById(cId);
    if(!cartById) {
        return res.status(404).send({message: "cart not found"});
    }
    res.send(cartById);
});

cartsRouter.post("/", async (req, res) => {
    const cartAdded = await cartManager.addCarts();
    if(!cartAdded) {
        return res.status(400).send({message: "error: cart not added"});
    }
    res.send({message: "cart added"});
});

cartsRouter.post("/:cId/product/:pId", async (req, res) => {
    const { cId, pId } = req.params;
    const productAddedToCart = await cartManager.addProductsToCart(pId, cId);
    if(!productAddedToCart) {
        return res.status(400).send({message: "error: product not added"});
    }
    res.send({message: "product added to cart"});
});

export default cartsRouter;