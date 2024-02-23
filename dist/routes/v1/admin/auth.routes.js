"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_controller_1 = tslib_1.__importDefault(require("../../../controllers/admin/auth.controller"));
const inputValidation_1 = require("../../../middlewares/inputValidation");
const auth_middleware_1 = tslib_1.__importDefault(require("../../../middlewares/auth.middleware"));
const validatedToken_middleware_1 = tslib_1.__importDefault(require("../../../middlewares/validatedToken.middleware"));
class AdminAuthRoute {
    path = "/api/v1/admin/auth";
    router = express_1.Router();
    adminAuthController = new auth_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/profile", auth_middleware_1.default, this.adminAuthController.getProfile);
        this.router.post(this.path + "/login", inputValidation_1.adminLoginInput, this.adminAuthController.login);
        this.router.post(this.path + "/register", inputValidation_1.adminRegisterInput, this.adminAuthController.register);
        this.router.post(this.path + "/forgot-password", inputValidation_1.adminForgotInput, this.adminAuthController.forgotPassword);
        this.router.get(this.path + "/verify-token", validatedToken_middleware_1.default, (req, res) => {
            res.json({ success: true, message: "Token verified" });
        });
        this.router.post(this.path + "/reset-password", validatedToken_middleware_1.default, inputValidation_1.adminResetInput, this.adminAuthController.resetPassword);
        this.router.put(this.path + "/change-password", auth_middleware_1.default, inputValidation_1.adminChangeInput, this.adminAuthController.changePassword);
        this.router.put(this.path + "/general-settings", auth_middleware_1.default, inputValidation_1.adminGeneralInput, this.adminAuthController.generalSettings);
    }
}
exports.default = AdminAuthRoute;
//# sourceMappingURL=auth.routes.js.map