import { Router } from "express";
import CartManager from "../dao/cartsManager.js";
import { cartsModel } from "../dao/models/carts.model.js";

const cartsRouter = Router();
const cartManager = new CartManager("src/data/carts.json");

cartsRouter.get("/", async (req, res) => {
    const carts = await cartsModel.find();
    try {
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "Carts not found"});
    }
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
    const newCart = req.body;
    const cartAdded = await cartsModel.create(newCart);
    try {
        res.send({message: "cart added"});
    } catch (error) {
        console.error(error);
        res.status(400).send({message: "error: cart not added"});
    }
});

cartsRouter.put("/:cId/product/:pId", async (req, res) => {
    const { cId, pId } = req.params;
    const carts = await cartsModel.find();
    const updatedCarts = carts.map(cart => {
        if(cart._id === cId) {
            const existingProduct = cart.products.find(p => p.id === pId);
            if(existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products = [...cart.products, {id: pId, quantity: 1}];
            }
        }
        return cart;
    });
    const productAddedToCart = await cartsModel.updateOne({_id: cId, products: updatedCarts});
    if(!productAddedToCart) {
        return res.status(400).send({message: "error: product not added"});
    }
    res.send({message: "product added to cart"});
});

export default cartsRouter;