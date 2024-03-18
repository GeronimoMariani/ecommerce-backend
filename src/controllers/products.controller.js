import ProductDTO from "../dao/dtos/product.dto.js";
import Products from "../dao/mongo/products.mongo.js";
import CustomErrors from "../service/errors/CustomError.js";
import ErrorEnum from "../service/errors/error.enum.js";
import { generateProductErrorInfo, productNotFound } from "../service/errors/info.js";
import { generateProduct } from "../utils/faker.js";

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
        CustomErrors.createError({
            name: "Find product failed",
            cause: productNotFound(pId),
            message: "Error trying to find a single product",
            code: ErrorEnum.PRODUCT_NOT_FOUND,
        });
    }
    return res.send(product);
};

export const createProduct = async (req, res) => {
    const newProduct = new ProductDTO(req.body);
    if (!newProduct.title || !newProduct.description || !newProduct.category || !newProduct.code || !newProduct.stock || !newProduct.thumbnail || !newProduct.price) {
        CustomErrors.createError({
            name: "Product creation fails",
            cause: generateProductErrorInfo(newProduct),
            message: "Error trying to create product",
            code: ErrorEnum.INVALID_TYPE_ERROR
        });
    }
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

export const mockingProducts = (req, res) => {
    const users = [];
    for(let i=0; i<100; i++){
        users.push(generateProduct());
    }
    res.send({status: 'success', payload: users});
};