"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
}, {
    timestamps: true,
});
const adminModel = mongoose_1.model("Admin", adminSchema);
exports.default = adminModel;
//# sourceMappingURL=admin.model.js.map