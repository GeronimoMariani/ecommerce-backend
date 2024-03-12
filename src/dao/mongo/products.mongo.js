import { productsModel } from "../../models/products.model.js";

export default class Products {

    getProducts = async () => {
        try {
            const products = await productsModel.find();
            return products;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getProductsPaginate = async (limit, sort, page, filter) => {
        try {
            const pageOptions = {
                limit: !limit ? 10 : limit,
                sort: sort ? { price: +sort } : undefined,
                page: page ? page : 1
            }
            const products = await productsModel.paginate(filter ? { category: filter } : {}, pageOptions);
            return products;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getProductById = async (pId) => {
        try {
            const product = await productsModel.findOne({_id: pId});
            return product;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    createProduct = async (product) => {
        try {
            const result = await productsModel.create(product);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    updateProduct = async (id, product) => {
        try {
            const result = await productsModel.findOneAndUpdate({_id: id}, {$set: product});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    deleteProduct = async (id) => {
        try {
            const result = await productsModel.deleteOne({_id: id});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}