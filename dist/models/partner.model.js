"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    url: String,
    publicKey: String
});
const partnerSchema = new mongoose_1.Schema({
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
    address: {
        type: String,
    },
    promotion: {
        type: String,
    },
    comment: {
        type: String,
    },
    documents: [documentSchema],
    affliate_id: {
        type: String,
    },
    description: {
        type: String,
    },
    aboutUs: {
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
const partnerModel = mongoose_1.model("Partner", partnerSchema);
exports.default = partnerModel;
//# sourceMappingURL=partner.model.js.map