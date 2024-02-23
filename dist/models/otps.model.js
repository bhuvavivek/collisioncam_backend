"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });
const otpModel = mongoose_1.model('Otp', otpSchema);
exports.default = otpModel;
//# sourceMappingURL=otps.model.js.map