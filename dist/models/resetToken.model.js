"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const resetPassSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "admin",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
resetPassSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });
const resetPassModel = mongoose_1.model("ResetPass", resetPassSchema);
exports.default = resetPassModel;
//# sourceMappingURL=resetToken.model.js.map