import Carts from "../dao/mongo/carts.mongo.js";
import Products from "../dao/mongo/products.mongo.js";
import Ticket from "../dao/mongo/tickets.mongo.js";

const cartService = new Carts();
const ticketService = new Ticket();
const productService = new Products();

export const getCarts = async (req, res) => {
    const carts = await cartService.getCarts();
    if (!carts) {
        return res.status(404).send({message: "Carts not found"});
    }
    return res.send(carts);
};

export const getCartById = async (req, res) => {
    const { cId } = req.params;
    const cart = await cartService.getCartById(cId);
    if (!cart) {
        return res.status(404).send({message: "cart not found"});
    }
    return res.send(cart);
};

export const createCart = async (req, res) => {
    const newCart = req.body;
    const cart = await cartService.createCart(newCart);
    if (!cart) {
        return res.status(400).send({message: "error: cart not added"});
    }
    return res.status(201).send({message: "cart added"});
};

export const addProductToCart = async (req, res) => {
    const { cId, pId } = req.params;
    const cart = await cartService.getCartById(cId);
    const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({ product: pId });
    }
    await cart.save();
    if (!cart) {
        return res.status(404).send({message: "error: cart not found"});
    }
    return res.send({message: "cart updated"});
};

export const updateCart = async (req, res) => {
    const { cId } = req.params;
    const cartUpdated = req.body;
    const result = await cartService.updateCart(cId, cartUpdated);
    if (!result) {
        return res.status(404).send({message: "error: cart not found"});
    }
    return res.send({message: "cart updated"});
};

export const updateProductInCart = async (req, res) => {
    const { cId, pId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.getCartById(cId);
    if (!cart) {
        return res.status(404).send({ message: "Error: Cart not found" });
    }
    const productIndex = cart.products.findIndex(product => product.product.equals(pId));
    if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.send({ message: "Product updated" });
    } else {
        res.status(404).send({ message: "Error: Product not found" });
    }
};

export const deleteProductInCart = async (req, res) => {
    const { cId, pId } = req.params;
    const cart = await cartService.getCartById(cId);
    if (!cart) {
        return res.status(404).send({message: "Error: Cart not found"});
    }
    const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
    if (existingProduct) {
        cart.products = cart.products.filter(product => product.product._id.toString() !== pId);
        await cart.save();
        res.send({message: "product deleted"});
    } else {
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
        code: Math.floor(Math.random() * 9000000) + 1000000,
        purchase_datatime: new Date(),
        amount: totalprice,
        purchaser: req.user.email
    }
    await ticketService.createTicket(newTicket);
    return res.send({message: "Ticket create"});
};