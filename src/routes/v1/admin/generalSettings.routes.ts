import { Router } from "express";
import Route from "@interfaces/routes.interface";
import {
  notificationSettingsInput,
  requestSettingsInput,
  uploadFootageInput,
} from "@/middlewares/inputValidation";
import authMiddleware from "@/middlewares/auth.middleware";
import AdminFootageController from "@/controllers/admin/footage.controller";
import generalSettingsController from "@/controllers/admin/generalSettings.controller";

class generalSettingsRoute implements Route {
  public path = "/api/v1/general-settings";
  public router = Router();

  public generalSettings = new generalSettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path + "/", this.generalSettings.getGeneralSettings);

    this.router.put(
      this.path + "/notification/:id",
      notificationSettingsInput,
      this.generalSettings.notificationSettings
    );

    this.router.put(
      this.path + "/request/:id",
      requestSettingsInput,
      this.generalSettings.requestSettings
    );


  }
}

export default generalSettingsRoute;
