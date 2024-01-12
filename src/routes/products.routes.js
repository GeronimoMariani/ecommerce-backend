import { Router } from "express";
import { productsModel } from "../dao/models/products.model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    const {limit} = req.query;
    const products = await productsModel.find();
    try {
        if (!limit) {
            return res.send(products);
        }
        const limitProducts = products.slice(0, limit);
        res.send(limitProducts);
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "Products not found"});
    }
});

productsRouter.get("/:pid", async (req, res) => {
    const {pid} = req.params;
    try {
        const products = await productsModel.findOne({_id: pid});
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Product not found"});
    }
});

productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        const addProduct = await productsModel.create(newProduct);
        res.status(201).send({message: "Product added"});
    } catch (error) {
        res.status(400).send({message: "Error adding product"});
        console.log(error);
    }
});

productsRouter.put("/:pId", async (req, res) => {
    const { pId } = req.params;
    const updateProduct = req.body;
    try {
        const products = await productsModel.updateOne({_id: pId}, updateProduct);
        res.send({message: "Product updated"});
    } catch (error) {
        console.error(error);
        res.status(404).send({message:"Product not found"});
    }
});

productsRouter.delete("/:pId", async (req, res) => {
    const { pId } = req.params;
    try {
        const deleteProduct = await productsModel.deleteOne({_id: pId});
        if (deleteProduct.deletedCount === 0) {
            return res.status(404).send({message: "Product not found"})
        }
        res.send({message: "Product deleted"});
    } catch (error) {
        console.error(error);
        res.status(404).send({message: "Product not found"});
    }
});

export default productsRouter;