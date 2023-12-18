import { Router } from "express";
import ProductManager from "../utils/productManager.js";

const productsRouter = Router();
const productManager = new ProductManager("src/data/products.json");

productsRouter.get("/", async (req, res) => {
    const {limit} = req.query;
    const products = await productManager.getProducts();
    if (!limit) {
        return res.send(products);
    }
    const limitProducts = products.slice(0, limit);
    res.send(limitProducts);
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const {pid} = req.params;
        const products = await productManager.getProductById(parseInt(pid));
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Product not found"});
    }
});

productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        const addProduct = await productManager.addProduct(newProduct);
        res.send({message: "Product added"});
    } catch (error) {
        res.send({message: "Error adding product"});
        console.log(error);
    }
});

productsRouter.put("/:pId", async (req, res) => {
    try {
        const { pId } = req.params;
        const updateProduct = req.body;
        const products = await productManager.updateProduct(updateProduct, pId);
        res.send({message: "Product updated"});
    } catch (error) {
        console.error(error);
        res.status(404).send({message:"Product not found"});
    }
});

productsRouter.delete("/:pId", async (req, res) => {
    const { pId } = req.params;
    const deleteProduct = await productManager.deleteProduct(pId);
    res.send({message: "Product deleted"});
});

export default productsRouter;