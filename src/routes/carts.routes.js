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
        res.status(201).send({message: "cart added"});
    } catch (error) {
        console.error(error);
        res.status(400).send({message: "error: cart not added"});
    }
});

cartsRouter.post("/:cId/product/:pId", async (req, res) => {
    const { cId, pId } = req.params;
    try {
        const cart = await cartsModel.findOne({_id: cId});
        const existingProduct = cart.products.find(product => product.product.toString() === pId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: pId });
        }
        await cartsModel.updateOne({_id: cId}, cart);
        res.send({message: "cart updated"});
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "error: cart not found"});
    }
});

cartsRouter.put("/:cId", async (req, res) => {
    const { cId } = req.params;
    const cartUpdated = req.body;
    try {
        await cartsModel.updateOne({_id: cId}, cartUpdated);
        res.send({message: "cart updated"});
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "error: cart not found"});
    }
});

cartsRouter.put("/:cId/product/pId", async (req, res,) => {
    const { cId, pId } = req.params;
    const quantityUpdated = req.body;
    try {
        const cart = await cartsModel.findOne({_id: cId});
        const existingProduct = cart.products.find(product => product.product.toString() === pId);
        if (existingProduct) {
            existingProduct.quantity = quantityUpdated;
            res.send({message: "Product updated"});
        } else {
            res.status(404).send({message: "Error: Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "error: cart not found"});
    }
});

cartsRouter.delete("/:cId/product/:pId", async (req, res) => {
    const { cId, pId } = req.params;
    try {
        const cart = await cartsModel.findOne({_id: cId});
        const existingProduct = cart.products.find(product => product.product.toString() === pId);
        if (existingProduct) {
            cart.products = cart.products.filter(product => product.product.toString() !== pId);
            await cart.save();
            res.send({message: "product deleted"});
        } else {
            res.status(404).send({message: "Error: Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "Error: Cart not found"});
    }
});

export default cartsRouter;