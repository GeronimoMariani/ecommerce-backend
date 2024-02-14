import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";

const viewsRouter = Router();

viewsRouter.get("/products", checkAuth, async (req, res) => {
    const { page } = req.query;
    const { user } = req.session;
    try {
        const pageNumber = page ? +page : 1;
        const products = await productsModel.paginate({}, {limit: 5, page: pageNumber});
        const prevPage = pageNumber - 1 >= 1 ? pageNumber - 1 : null;
        const nextPage = pageNumber + 1;
        products.prevLink = `/products?page=${prevPage}`;
        products.nextLink = `/products?page=${nextPage}`;
        res.render("products", { products, user: user });
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

viewsRouter.get("/carts/:cId", async (req, res) => {
    const { cId } = req.params;
    try {
        const cart = await cartsModel.findOne({_id: cId });
        res.render("carts", { cart });
    } catch (error) {
        console.error("Error finding cart:", error);
        res.status(400).send(error);
    }
});

viewsRouter.get("/", async (req, res) => {
    res.render("index");
});

viewsRouter.get("/login", checkExistingUser, (req, res) => {
    res.render("login");
});

viewsRouter.get("/register", checkExistingUser, (req, res) => {
    res.render("register");
});

viewsRouter.get("/restore-password", checkExistingUser, (req, res) => {
    res.render("restore-password");
});

viewsRouter.get("/fail-register", (req, res) => {
    res.render("fail-register");
});

viewsRouter.get("/fail-login", (req, res) => {
    res.render("fail-login");
});

viewsRouter.get("/current", (req, res) => {
    const { user } = req.session;
    res.render("current", user);
});

/* viewsRouter.get("/realtimeproducts", async (req, res) => {
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
}); */

export default viewsRouter;