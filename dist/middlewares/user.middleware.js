"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const HttpException_1 = tslib_1.__importDefault(require("../exceptions/HttpException"));
const locale_en_json_1 = tslib_1.__importDefault(require("../utils/locale.en.json"));
const subscription_model_1 = tslib_1.__importDefault(require("../models/subscription.model"));
const userMiddleware = async (req, res, next) => {
    try {
        const Authorization = req.header("Authorization").split("Bearer ")[1] ||
            req.cookies["Authorization"] ||
            null;
        if (Authorization) {
            const verificationResponse = (await jsonwebtoken_1.default.verify(Authorization, process.env.JWT_SECRECT));
            const userId = verificationResponse.id;
            const findUser = await subscription_model_1.default.findById(userId);
            findUser.password = undefined;
            const currentTimestamp = Date.now();
            const isValidSubscription = currentTimestamp <= new Date(findUser.expireAt).getTime();
            if (findUser) {
                req.user = findUser;
                req.isValidSubscription = isValidSubscription;
                next();
            }
            else {
                next(new HttpException_1.default(401, locale_en_json_1.default.UNAUTHORIZED));
                next();
            }
        }
        else {
            next(new HttpException_1.default(404, locale_en_json_1.default.AUTH_MISSING));
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: locale_en_json_1.default.AUTH_WRONG });
    }
};
exports.default = userMiddleware;
//# sourceMappingURL=user.middleware.js.map