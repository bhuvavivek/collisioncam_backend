"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = tslib_1.__importDefault(require("../../../middlewares/auth.middleware"));
const footage_controller_1 = tslib_1.__importDefault(require("../../../controllers/admin/footage.controller"));
const cloudinary_1 = require("cloudinary");
const multer_1 = tslib_1.__importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: "dcdwbdzql",
    api_key: "916793923444751",
    api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage });
class AdminFootageRoute {
    path = "/api/v1/admin/footage";
    router = express_1.Router();
    adminFootageController = new footage_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + "/upload", 
        // uploadFootageInput,
        auth_middleware_1.default, 
        // upload.fields([
        //   { name: "video", maxCount: 1 },
        //   { name: "photo", maxCount: 1 },
        // ]),
        this.adminFootageController.uploadFootage);
        this.router.post(this.path + "/edit/:footageId", auth_middleware_1.default, 
        // upload.fields([
        //   { name: "video", maxCount: 1 },
        //   { name: "photo", maxCount: 1 },
        // ]),
        this.adminFootageController.editFootage);
        this.router.get(this.path + "/private", auth_middleware_1.default, this.adminFootageController.getFootageAdmin);
        this.router.get(this.path, this.adminFootageController.getFootage);
        this.router.get(this.path + "/details/:id", this.adminFootageController.getSingleFootage);
        this.router.get(this.path + "/details-private/:id", auth_middleware_1.default, this.adminFootageController.getSingleFootagePrivate);
        this.router.delete(this.path + "/delete/:id", this.adminFootageController.deleteFootage);
    }
}
exports.default = AdminFootageRoute;
//# sourceMappingURL=footage.routes.js.map