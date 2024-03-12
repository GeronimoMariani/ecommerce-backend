import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datatime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);