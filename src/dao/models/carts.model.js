import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);