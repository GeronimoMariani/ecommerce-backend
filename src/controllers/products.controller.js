import ProductDTO from "../dao/dtos/product.dto.js";
import Products from "../dao/mongo/products.mongo.js";

const productService = new Products();

export const getProducts = async (req, res) => {
    const { limit, sort, page, filter } = req.query;
    const products = await productService.getProductsPaginate(limit, sort, page, filter)
    if (!products) {
        return res.status(404).send({message: "Products not found"});
    }
    return res.send(products);
};

export const getProductById = async (req, res) => {
    const {pId} = req.params;
    const product = await productService.getProductById(pId);
    if (!product) {
        return res.status(404).send({ message: "Product not found"});
    }
    return res.send(product);
};

export const createProduct = async (req, res) => {
    const newProduct = new ProductDTO(req.body);
    const addProduct = await productService.createProduct(newProduct);
    if (!addProduct) {
        return res.status(400).send({message: "Error adding product"});
    }
    return res.status(201).send({message: "Product added"});
};

export const updateProduct = async (req, res) => {
    const { pId } = req.params;
    const updateProduct = req.body;
    const product = await productService.updateProduct(pId, updateProduct);
    if (!product) {
        return res.status(404).send({message:"Product not found"});
    }
    return res.send({message: "Product updated"});
};

export const deleteProduct = async (req, res) => {
    const { pId } = req.params;
    const deleteProduct = await productService.deleteProduct(pId);
    if (deleteProduct.deletedCount === 0) {
        return res.status(404).send({message: "Product not found"})
    }
    return res.send({message: "Product deleted"});
};