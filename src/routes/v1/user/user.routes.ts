import { Router } from "express";
import Route from "@interfaces/routes.interface";
import {
  affliateUpdateInput,
  becomeAffliateInput,
  partnerInput,
  requestInput,
  requestUpdateInput,
  sellInput,
} from "@/middlewares/inputValidation";
import UserController from "@/controllers/user/user.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dcdwbdzql",
  api_key: "916793923444751",
  api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class UserRoute implements Route {
  public path = "/api/v1/user";
  public router = Router();

  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ==== START REQUEST SECTION ====

    // Create
    this.router.get(
      this.path + "/recent-activity",
      authMiddleware,
      this.userController.recentActivty
    );
    this.router.get(
      this.path + "/footage-chart",
      // authMiddleware,
      this.userController.footageSalesChart
    );

    this.router.get(
      this.path + "/total-footage-sales",
      authMiddleware,
      this.userController.totalFootageSales
    );

    this.router.post(
      this.path + "/request-send",
      requestInput,
      // upload.fields([{ name: 'document', maxCount: 1 }]),
      this.userController.sendRequest
    );

    // Read all
    this.router.get(
      this.path + "/get-request",
      authMiddleware,
      this.userController.getRequest
    );

    // Read single
    this.router.get(
      this.path + "/get-single-request/:id",
      authMiddleware,
      this.userController.getSingleRequest
    );

    this.router.post(
      this.path + "/test-pdf-upload",
      this.userController.testPdfUpload
    );


    // Update
    this.router.put(
      this.path + "/update-request/:id",
      authMiddleware,
      requestUpdateInput,
      this.userController.updateRequest
    );

    // Delete
    this.router.post(
      this.path + "/create-checkout-session",
      this.userController.createCheckoutSession
    );

    // ==== END REQUEST SECTION ====

    // ==== START AFFLIATE SECTION ====

    this.router.delete(
      this.path + "/delete-request/:id",
      authMiddleware,
      this.userController.deleteRequest
    );

    // ==== END REQUEST SECTION ====

    // ==== START AFFLIATE SECTION ====

    // Create
    this.router.post(
      this.path + "/become-affliate",
      becomeAffliateInput,
      this.userController.becomeAffliate
    );

    // Read all
    this.router.get(
      this.path + "/get-affliate",
      authMiddleware,
      this.userController.getAffliate
    );

    this.router.get(
      this.path + "/affliate-performance",
      authMiddleware,
      this.userController.getAffiliatePerformance
    );

    // Read
    this.router.get(
      this.path + "/get-single-affliate/:id",
      authMiddleware,
      this.userController.getSingleAffliate
    );

    // Update
    this.router.put(
      this.path + "/update-affliate/:id",
      authMiddleware,
      affliateUpdateInput,
      this.userController.updateAffliate
    );

    // Delete
    this.router.delete(
      this.path + "/delete-affliate/:id",
      authMiddleware,
      this.userController.deleteAffliate
    );

    // ==== END AFFLIATE SECTION ====

    this.router.post(
      this.path + "/sell-claim",
      sellInput,
      this.userController.sellClaim
    );

    this.router.get(
      this.path + "/get-sell-claim",
      authMiddleware,
      this.userController.getSellClaim
    );

    this.router.get(
      this.path + "/get-single-sell-claim/:id",
      authMiddleware,
      this.userController.getSingleSellClaim
    );

    // Update
    this.router.put(
      this.path + "/update-sell-claim/:id",
      authMiddleware,
      affliateUpdateInput,
      this.userController.updateSellClaim
    );

    // Delete
    this.router.delete(
      this.path + "/delete-sell-claim/:id",
      authMiddleware,
      this.userController.deleteSellClaim
    );

    this.router.post(
      this.path + "/partnerd-firms",
      partnerInput,
      this.userController.partnerFirms
    );

    this.router.get(
      this.path + "/get-partnerd-firms",
      authMiddleware,
      this.userController.getPartnerFirms
    );

    this.router.get(
      this.path + "/get-single-partnerd-firms/:id",
      authMiddleware,
      this.userController.getSinglePartnerFirm
    );

    // Update
    this.router.put(
      this.path + "/update-partnerd-firms/:id",
      authMiddleware,
      affliateUpdateInput,
      this.userController.updatePartnerfirm
    );

    // Delete
    this.router.delete(
      this.path + "/delete-partnerd-firms/:id",
      authMiddleware,
      this.userController.deletePartnerfirm
    );




    this.router.get(
      this.path + "/capture",
      this.userController.getCapture
    );
    this.router.post(
      this.path + "/capture/add",
      authMiddleware,
      this.userController.addCapture
    );
    this.router.put(
      this.path + "/capture/update",
      authMiddleware,
      this.userController.updateCapture
    );
  }
}

export default UserRoute;
