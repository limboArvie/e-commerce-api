const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User Id is required."]
    },
    items: [
        {
            productId: {
                type: String,
                required: [true, "Product Id is required."]
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required."]
            },
            subTotal: {
                type: Number,
                required: [true, "Subtotal is required."]
            },
            itemDiscount: {
                type: Number,
                default: 0
            }
        }
    ],
    total: {
        type: Number,
        required: [true, "Total is required."]
    }
});

module.exports = mongoose.model("Cart", cartSchema);