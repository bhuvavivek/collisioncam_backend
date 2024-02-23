"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import AjaxController from "@controllers/ajax.controller";
class AjaxRoute {
    path = "/ajax";
    router = express_1.Router();
    // public ajaxController = new AjaxController();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
    }
}
exports.default = AjaxRoute;
//# sourceMappingURL=ajax.route.js.map