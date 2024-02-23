"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const payment_controller_1 = tslib_1.__importDefault(require("../../../controllers/admin/payment.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../../../middlewares/auth.middleware"));
const express_1 = require("express");
class paymentRoute {
    path = "/api/v1/payment";
    router = express_1.Router();
    payment = new payment_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/", auth_middleware_1.default, this.payment.getPayment);
        this.router.get(this.path + "/details/:id", auth_middleware_1.default, this.payment.getSinglePayment);
        this.router.delete(this.path + "/delete/:id", auth_middleware_1.default, this.payment.deletePayment);
    }
}
exports.default = paymentRoute;
//# sourceMappingURL=payment.routes.js.map