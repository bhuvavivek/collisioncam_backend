"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const footageSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    id: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    description: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    thumbnailPublicKey: {
        type: String,
    },
    video: {
        type: String,
    },
    videoPublicKey: {
        type: String,
    },
}, {
    timestamps: true,
});
const footageModel = mongoose_1.model("Footage", footageSchema);
exports.default = footageModel;
//# sourceMappingURL=foogate.model.js.map