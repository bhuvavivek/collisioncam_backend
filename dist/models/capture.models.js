"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const captureSchema = new mongoose_1.Schema({
    type: {
        type: String,
    },
    value: {
        type: String,
    },
}, {
    timestamps: true,
});
const captureModel = mongoose_1.model("capture", captureSchema);
exports.default = captureModel;
//# sourceMappingURL=capture.models.js.map