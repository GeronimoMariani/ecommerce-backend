import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

cartsSchema.pre("find", function(){
    this.populate("products.product");
});

cartsSchema.pre("findOne", function(){
    this.populate("products.product");
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);