"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    expireAt: {
        type: String,
    },
    date: {
        type: String,
        default: Date.now(),
    },
    amount: {
        type: String,
    },
    type: {
        type: String,
    },
    products: [
        {
            type: new mongoose_1.Schema({
                _id: { type: String, required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                thumbnail: { type: String, required: true },
                video: { type: String, required: true },
                description: { type: String },
                // Add any other fields related to a product
            }),
            required: false, // Make the array optional
        },
    ],
    status: {
        type: String,
        enum: ['pending', 'success', 'rejected'],
        default: 'pending'
    },
    secretkey: {
        type: String,
    }
}, {
    timestamps: true,
});
const paymentModel = mongoose_1.model("Payment", paymentSchema);
exports.default = paymentModel;
//# sourceMappingURL=payment.model.js.map