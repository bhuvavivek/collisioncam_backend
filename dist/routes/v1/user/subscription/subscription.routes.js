"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const cloudinary_1 = require("cloudinary");
const multer_1 = tslib_1.__importDefault(require("multer"));
const inputValidation_1 = require("../../../../middlewares/inputValidation");
const auth_middleware_1 = tslib_1.__importDefault(require("../../../../middlewares/auth.middleware"));
const subscription_controller_1 = tslib_1.__importDefault(require("../../../../controllers/user/subscription/subscription.controller"));
const user_middleware_1 = tslib_1.__importDefault(require("../../../../middlewares/user.middleware"));
cloudinary_1.v2.config({
    cloud_name: "dcdwbdzql",
    api_key: "916793923444751",
    api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage });
class SubsriptionRoute {
    path = "/api/v1/subscription";
    router = express_1.Router();
    subscriptionController = new subscription_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + "/request", inputValidation_1.subscriptionInput, this.subscriptionController.requestSubscription);
        this.router.get(this.path, auth_middleware_1.default, this.subscriptionController.getSubscription);
        this.router.get(this.path + "/details/:id", auth_middleware_1.default, this.subscriptionController.getSingleSubscription);
        this.router.delete(this.path + "/delete/:id", auth_middleware_1.default, this.subscriptionController.deleteSubscription);
        this.router.put(this.path + "/approve/:userId", auth_middleware_1.default, inputValidation_1.subscriptionApprovedInput, this.subscriptionController.approveSubscription);
        this.router.get(this.path + "/payemt/success/:secretKey", this.subscriptionController.handlePaymentSuccess);
        this.router.post(this.path + "/login", this.subscriptionController.subscriptionLogin);
        this.router.get(this.path + "/get-profile", user_middleware_1.default, this.subscriptionController.subscriptionProfile);
        this.router.get(this.path + "/download/:footageId", user_middleware_1.default, this.subscriptionController.dowloadVideo);
        this.router.post(this.path + "/renew", user_middleware_1.default, this.subscriptionController.renewSubscription);
        this.router.post(this.path + "/change/password", user_middleware_1.default, this.subscriptionController.changePassword);
        this.router.post(this.path + "/change/username", user_middleware_1.default, this.subscriptionController.changeUsername);
    }
}
exports.default = SubsriptionRoute;
//# sourceMappingURL=subscription.routes.js.map