import { Router } from "express";
import Route from "@interfaces/routes.interface";
import AdminAuthController from "@/controllers/admin/auth.controller";
import {
  adminChangeInput,
  adminForgotInput,
  adminGeneralInput,
  adminLoginInput,
  adminRegisterInput,
  adminResetInput,
} from "@/middlewares/inputValidation";
import authMiddleware from "@/middlewares/auth.middleware";
import validatedTokenMiddleware from "@/middlewares/validatedToken.middleware";

class AdminAuthRoute implements Route {
  public path = "/api/v1/admin/auth";
  public router = Router();

  public adminAuthController = new AdminAuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path + "/profile",
      authMiddleware,
      this.adminAuthController.getProfile
    );
    this.router.post(
      this.path + "/login",
      adminLoginInput,
      this.adminAuthController.login
    );

    this.router.post(
      this.path + "/register",
      adminRegisterInput,
      this.adminAuthController.register
    );

    this.router.post(
      this.path + "/forgot-password",
      adminForgotInput,
      this.adminAuthController.forgotPassword
    );

    this.router.get(
      this.path + "/verify-token",
      validatedTokenMiddleware,
      (req, res) => {
        res.json({ success: true, message: "Token verified" });
      }
    );

    this.router.post(
      this.path + "/reset-password",
      validatedTokenMiddleware,
      adminResetInput,
      this.adminAuthController.resetPassword
    );

    this.router.put(
      this.path + "/change-password",
      authMiddleware,
      adminChangeInput,
      this.adminAuthController.changePassword
    );

    this.router.put(
      this.path + "/general-settings",
      authMiddleware,
      adminGeneralInput,
      this.adminAuthController.generalSettings
    );
  }
}

export default AdminAuthRoute;
