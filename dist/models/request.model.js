"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    url: String,
    publicKey: String
});
const requestSchema = new mongoose_1.Schema({
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
    footageName: {
        type: String,
        required: true,
    },
    footageId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    partneredLawFirms: {
        type: String,
        required: true,
    },
    documents: [documentSchema],
    aboutUs: {
        type: String,
    },
    type: {
        type: String,
        enum: ["free", "paid"],
        default: "free",
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["approved", "rejected", "pending"],
        default: "pending",
    },
}, {
    timestamps: true,
});
const requestModel = mongoose_1.model("Request", requestSchema);
exports.default = requestModel;
//# sourceMappingURL=request.model.js.map