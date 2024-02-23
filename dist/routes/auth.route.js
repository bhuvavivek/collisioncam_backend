"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AuthRoute {
    path = "/api/auth";
    router = express_1.Router();
    // public authController = new AuthController();
    // public otpController = new OtpController();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/", this.getProfile);
    }
    getProfile(req, res) {
        res.send("Get User Profile");
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map