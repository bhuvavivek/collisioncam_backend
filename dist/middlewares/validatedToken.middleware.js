"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin_model_1 = tslib_1.__importDefault(require("../models/admin.model"));
const locale_en_json_1 = tslib_1.__importDefault(require("../utils/locale.en.json"));
const mongoose_1 = require("mongoose");
const resetToken_model_1 = tslib_1.__importDefault(require("../models/resetToken.model"));
const validatedTokenMiddleware = async (req, res, next) => {
    try {
        const { token, id } = req.query;
        if (!token || !id)
            return res.status(401).json({ message: "Invalid request!" });
        if (!mongoose_1.isValidObjectId(id))
            return res.status(401).json({ message: "Invalid user" });
        const user = await admin_model_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const resetToken = await resetToken_model_1.default.findOne({ user: user._id });
        if (!resetToken)
            return res.status(404).json({ message: "Reset token not found!" });
        const isValid = resetToken.token === token;
        if (!isValid)
            return res.status(401).json({ message: "Reset token is invalid!" });
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: locale_en_json_1.default.AUTH_WRONG });
    }
};
exports.default = validatedTokenMiddleware;
//# sourceMappingURL=validatedToken.middleware.js.map