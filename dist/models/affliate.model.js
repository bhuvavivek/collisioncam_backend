"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    url: String,
    publicKey: String
});
const affliateSchema = new mongoose_1.Schema({
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
    documents: [documentSchema],
    experience: {
        type: String,
    },
    promotionMethod: {
        type: String,
    },
    comments: {
        type: String,
    },
    status: {
        type: String,
        enum: ["approved", "reject", "pending"],
        default: "pending",
    },
    affliate_id: {
        type: String,
    },
    totalSale: {
        type: String,
    },
    description: {
        type: String,
    },
    commissionRate: {
        type: String,
    },
    address: {
        type: String,
    },
    numberOfSale: {
        type: String,
    },
    paidEarning: {
        type: String,
    },
    unpaidEarning: {
        type: String,
    },
}, {
    timestamps: true,
});
const affliateModel = mongoose_1.model("Affliate", affliateSchema);
exports.default = affliateModel;
//# sourceMappingURL=affliate.model.js.map