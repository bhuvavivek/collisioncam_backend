"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sellSchema = new mongoose_1.Schema({
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
    date: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    referenceNumber: {
        type: String,
    },
    reason: {
        type: String,
    },
    document: {
        type: String,
    },
    documentPublicKey: {
        type: String,
    },
    status: {
        type: String,
        enum: ["approved", "reject", "pending"],
        default: "pending",
    },
}, {
    timestamps: true,
});
const sellModel = mongoose_1.model("Sell", sellSchema);
exports.default = sellModel;
//# sourceMappingURL=sell.model.js.map