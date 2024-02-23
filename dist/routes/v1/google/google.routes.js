"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Google_controller_1 = tslib_1.__importDefault(require("../../../controllers/google/Google.controller"));
class GoogleRoute {
    path = "/api/v1/google";
    router = express_1.Router();
    googleController = new Google_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + '/reviews', this.googleController.getReviews);
    }
}
exports.default = GoogleRoute;
//# sourceMappingURL=google.routes.js.map