"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IndexController from "@controllers/index.controller";
class IndexRoute {
    path = "/api";
    router = express_1.Router();
    // public indexController = new IndexController();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/testing", (req, res) => {
            res.send("testing");
        });
    }
}
exports.default = IndexRoute;
//# sourceMappingURL=index.route.js.map