import { cartsModel } from "../../models/carts.model.js";

export default class Carts {

    getCarts = async () => {
        try {
            const result = await cartsModel.find();
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getCartById = async (cId) => {
        try {
            const result = await cartsModel.findOne({_id: cId});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    createCart = async (cart) => {
        try {
            const result = await cartsModel.create(cart);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    updateCart = async (cId, cart) => {
        try {
            const result = await cartsModel.findOneAndUpdate({_id: cId }, {$set: cart});
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}