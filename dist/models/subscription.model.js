"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    url: String,
    publicKey: String
});
const subscriptionSchema = new mongoose_1.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
    },
    website: {
        type: String,
    },
    industry: {
        type: String,
    },
    address: {
        type: String,
    },
    comments: {
        type: String,
    },
    promotionMethod: {
        type: String,
    },
    // Subscription details
    amount: {
        type: String,
    },
    duration: {
        type: String,
    },
    expireAt: {
        type: String,
    },
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending", // Set default value to "pending"
    },
    aboutUs: {
        type: String,
    },
    // Authentication credentials
    userId: {
        type: String,
    },
    password: {
        type: String,
    },
    documents: [documentSchema],
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
const subscriptionModel = mongoose_1.model("Subscripsion", subscriptionSchema);
exports.default = subscriptionModel;
//# sourceMappingURL=subscription.model.js.map