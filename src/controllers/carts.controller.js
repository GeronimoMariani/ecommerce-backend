import Carts from "../dao/mongo/carts.mongo.js";
import Products from "../dao/mongo/products.mongo.js";
import Ticket from "../dao/mongo/tickets.mongo.js";
import { v4 as uuidv4 } from 'uuid';

const cartService = new Carts();
const ticketService = new Ticket();
const productService = new Products();

export const getCarts = async (req, res) => {
    const carts = await cartService.getCarts();
    if (!carts) {
        req.logger.error("Carts not found");
        return res.status(404).send({message: "Carts not found"});
    }
    req.logger.info("Carts found");
    return res.send(carts);
};

export const getCartById = async (req, res) => {
    const { cId } = req.params;
    const cart = await cartService.getCartById(cId);
    if (!cart) {
        req.logger.error("Cart not found");
        return res.status(404).send({message: "Cart not found"});
    }
    req.logger.info("Cart found");
    return res.send(cart);
};

export const createCart = async (req, res) => {
    const newCart = req.body;
    const cart = await cartService.createCart(newCart);
    if (!cart) {
        req.logger.error("Cart not added");
        return res.status(400).send({message: "error: cart not added"});
    }
    req.logger.info("Cart added");
    return res.status(201).send({message: "cart added"});
};

export const addProductToCart = async (req, res) => {
    const { cId, pId } = req.params;
    const cart = await cartService.getCartById(cId);
    const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
    if (req.user.rol === "premium") {
        const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
        if (existingProduct?.product.owner === req.user.email) {
            return res.status(403).send({message: "Unauthorized"});
        }
    }
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({ product: pId });
    }
    await cart.save();
    if (!cart) {
        req.logger.error("Cart not found");
        return res.status(404).send({message: "error: cart not found"});
    }
    req.logger.info("Cart updated");
    return res.send({message: "Cart updated"});
};

export const updateCart = async (req, res) => {
    const { cId } = req.params;
    const cartUpdated = req.body;
    const result = await cartService.updateCart(cId, cartUpdated);
    if (!result) {
        req.logger.error("Cart not found");
        return res.status(404).send({message: "error: cart not found"});
    }
    req.logger.info("Cart updated");
    return res.send({message: "Cart updated"});
};

export const updateProductInCart = async (req, res) => {
    const { cId, pId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.getCartById(cId);
    if (!cart) {
        req.logger.error("Cart not found");
        return res.status(404).send({ message: "Error: Cart not found" });
    }
    const productIndex = cart.products.findIndex(product => product.product.equals(pId));
    if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        req.logger.info("Product updated");
        res.send({ message: "Product updated" });
    } else {
        req.logger.error("Product not found");
        res.status(404).send({ message: "Error: Product not found" });
    }
};

export const deleteProductInCart = async (req, res) => {
    const { cId, pId } = req.params;
    const cart = await cartService.getCartById(cId);
    if (!cart) {
        req.logger.error("Cart not found");
        return res.status(404).send({message: "Error: Cart not found"});
    }
    const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
    if (existingProduct) {
        cart.products = cart.products.filter(product => product.product._id.toString() !== pId);
        await cart.save();
        req.logger.info("Product deleted");
        res.send({message: "product deleted"});
    } else {
        req.logger.error("Product not found");
        res.status(404).send({message: "Error: Product not found"});
    }
};

export const purchaseCart = async (req, res) => {
    const { cId } = req.params;
    const cart = await cartService.getCartById(cId);
    const productsNotPurchased = cart.products.filter(product => {
        return product.product.stock < product.quantity;
    });
    const productsPurchased = cart.products.filter(product => {
        return product.product.stock >= product.quantity;
    });
    if (productsNotPurchased.length > 0) {
        cart.products = productsNotPurchased;
        await cartService.updateCart(cId, cart);
    }
    const totalprice = productsPurchased.reduce((acc, product) => {
        return acc + (product.product.price * product.quantity);
    }, 0);
    for (const product of productsPurchased) {
        const remainingStock = product.product.stock - product.quantity;
        const newStock = {
            stock: remainingStock
        }
        await productService.updateProduct(product.product._id, newStock);
    }
    const newTicket = {
        code: uuidv4(),
        purchase_datatime: new Date(),
        amount: totalprice,
        purchaser: req.user.email
    }
    if (totalprice === 0) {
        req.logger.error("Not create ticket");
        return res.status(400).send({message: "Not create ticket"});
    }
    await ticketService.createTicket(newTicket);
    req.logger.info("Ticket create");
    return res.send({message: "Ticket create"});
};