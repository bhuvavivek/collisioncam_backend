import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Route from "@/interfaces/routes.interface";
import {
  subscriptionApprovedInput,
  subscriptionInput,
} from "@/middlewares/inputValidation";
import authMiddleware from "@/middlewares/auth.middleware";
import SubscriptionController from "@/controllers/user/subscription/subscription.controller";
import subscriptionModel from "@/models/subscription.model";
import userMiddleware from "@/middlewares/user.middleware";

cloudinary.config({
  cloud_name: "dcdwbdzql",
  api_key: "916793923444751",
  api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class SubsriptionRoute implements Route {
  public path = "/api/v1/subscription";
  public router = Router();

  public subscriptionController = new SubscriptionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path + "/request",
      subscriptionInput,
      this.subscriptionController.requestSubscription
    );

    this.router.get(
      this.path,
      authMiddleware,
      this.subscriptionController.getSubscription
    );

    this.router.get(
      this.path + "/details/:id",
      authMiddleware,
      this.subscriptionController.getSingleSubscription
    );

    this.router.delete(
      this.path + "/delete/:id",
      authMiddleware,
      this.subscriptionController.deleteSubscription
    );

    this.router.put(
      this.path + "/approve/:userId",
      authMiddleware,
      subscriptionApprovedInput,
      this.subscriptionController.approveSubscription
    );

    this.router.get(
      this.path + "/payemt/success/:secretKey",
      this.subscriptionController.handlePaymentSuccess
    );

    this.router.post(
      this.path + "/login",
      this.subscriptionController.subscriptionLogin
    );

    this.router.get(
      this.path + "/get-profile",
      userMiddleware,
      this.subscriptionController.subscriptionProfile
    );

    this.router.get(
      this.path + "/download/:footageId",
      userMiddleware,
      this.subscriptionController.dowloadVideo
    );

    this.router.post(
      this.path + "/renew",
      userMiddleware,
      this.subscriptionController.renewSubscription
    );
    this.router.post(
      this.path + "/change/password",
      userMiddleware,
      this.subscriptionController.changePassword
    );
    this.router.post(
      this.path + "/change/username",
      userMiddleware,
      this.subscriptionController.changeUsername
    );
  }
}

export default SubsriptionRoute;
