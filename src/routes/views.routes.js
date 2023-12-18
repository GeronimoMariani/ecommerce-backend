import { Router } from "express";
import ProductManager from "../utils/productManager.js";

const viewsRouter = Router();
const productsManager = new ProductManager("src/data/products.json");

viewsRouter.get("/", async (req, res) => {
    const products = await productsManager.getProducts();
    res.render("index", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productsManager.getProducts();
    res.render("realTimeProducts");
});

viewsRouter.post("/realtimeproducts", async (req, res) => {
    const newProduct = req.body;
    try {
        const addProduct = await productsManager.addProduct(newProduct);
        res.send({message: "Product added"});
    } catch (error) {
        res.send({message: "Error adding product"});
        console.log(error);
    }
});

viewsRouter.delete("/realtimeproducts/:pId", async (req, res) => {
    const { pId } = req.params;
    const deleteProduct = await productsManager.deleteProduct(pId);
    res.send({message: "Product deleted"});
});

export default viewsRouter;