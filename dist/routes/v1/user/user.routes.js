"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const inputValidation_1 = require("../../../middlewares/inputValidation");
const user_controller_1 = tslib_1.__importDefault(require("../../../controllers/user/user.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../../../middlewares/auth.middleware"));
const cloudinary_1 = require("cloudinary");
const multer_1 = tslib_1.__importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: "dcdwbdzql",
    api_key: "916793923444751",
    api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({ storage: storage });
class UserRoute {
    path = "/api/v1/user";
    router = express_1.Router();
    userController = new user_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        // ==== START REQUEST SECTION ====
        // Create
        this.router.get(this.path + "/recent-activity", auth_middleware_1.default, this.userController.recentActivty);
        this.router.get(this.path + "/footage-chart", 
        // authMiddleware,
        this.userController.footageSalesChart);
        this.router.get(this.path + "/total-footage-sales", auth_middleware_1.default, this.userController.totalFootageSales);
        this.router.post(this.path + "/request-send", inputValidation_1.requestInput, 
        // upload.fields([{ name: 'document', maxCount: 1 }]),
        this.userController.sendRequest);
        // Read all
        this.router.get(this.path + "/get-request", auth_middleware_1.default, this.userController.getRequest);
        // Read single
        this.router.get(this.path + "/get-single-request/:id", auth_middleware_1.default, this.userController.getSingleRequest);
        this.router.post(this.path + "/test-pdf-upload", this.userController.testPdfUpload);
        // Update
        this.router.put(this.path + "/update-request/:id", auth_middleware_1.default, inputValidation_1.requestUpdateInput, this.userController.updateRequest);
        // Delete
        this.router.post(this.path + "/create-checkout-session", this.userController.createCheckoutSession);
        // ==== END REQUEST SECTION ====
        // ==== START AFFLIATE SECTION ====
        this.router.delete(this.path + "/delete-request/:id", auth_middleware_1.default, this.userController.deleteRequest);
        // ==== END REQUEST SECTION ====
        // ==== START AFFLIATE SECTION ====
        // Create
        this.router.post(this.path + "/become-affliate", inputValidation_1.becomeAffliateInput, this.userController.becomeAffliate);
        // Read all
        this.router.get(this.path + "/get-affliate", auth_middleware_1.default, this.userController.getAffliate);
        this.router.get(this.path + "/affliate-performance", auth_middleware_1.default, this.userController.getAffiliatePerformance);
        // Read
        this.router.get(this.path + "/get-single-affliate/:id", auth_middleware_1.default, this.userController.getSingleAffliate);
        // Update
        this.router.put(this.path + "/update-affliate/:id", auth_middleware_1.default, inputValidation_1.affliateUpdateInput, this.userController.updateAffliate);
        // Delete
        this.router.delete(this.path + "/delete-affliate/:id", auth_middleware_1.default, this.userController.deleteAffliate);
        // ==== END AFFLIATE SECTION ====
        this.router.post(this.path + "/sell-claim", inputValidation_1.sellInput, this.userController.sellClaim);
        this.router.get(this.path + "/get-sell-claim", auth_middleware_1.default, this.userController.getSellClaim);
        this.router.get(this.path + "/get-single-sell-claim/:id", auth_middleware_1.default, this.userController.getSingleSellClaim);
        // Update
        this.router.put(this.path + "/update-sell-claim/:id", auth_middleware_1.default, inputValidation_1.affliateUpdateInput, this.userController.updateSellClaim);
        // Delete
        this.router.delete(this.path + "/delete-sell-claim/:id", auth_middleware_1.default, this.userController.deleteSellClaim);
        this.router.post(this.path + "/partnerd-firms", inputValidation_1.partnerInput, this.userController.partnerFirms);
        this.router.get(this.path + "/get-partnerd-firms", auth_middleware_1.default, this.userController.getPartnerFirms);
        this.router.get(this.path + "/get-single-partnerd-firms/:id", auth_middleware_1.default, this.userController.getSinglePartnerFirm);
        // Update
        this.router.put(this.path + "/update-partnerd-firms/:id", auth_middleware_1.default, inputValidation_1.affliateUpdateInput, this.userController.updatePartnerfirm);
        // Delete
        this.router.delete(this.path + "/delete-partnerd-firms/:id", auth_middleware_1.default, this.userController.deletePartnerfirm);
        this.router.get(this.path + "/capture", this.userController.getCapture);
        this.router.post(this.path + "/capture/add", auth_middleware_1.default, this.userController.addCapture);
        this.router.put(this.path + "/capture/update", auth_middleware_1.default, this.userController.updateCapture);
    }
}
exports.default = UserRoute;
//# sourceMappingURL=user.routes.js.map