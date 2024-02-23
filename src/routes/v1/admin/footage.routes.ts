import { Request, Router, Response, NextFunction } from "express";
import Route from "@interfaces/routes.interface";
import { uploadFootageInput } from "@/middlewares/inputValidation";
import authMiddleware from "@/middlewares/auth.middleware";
import AdminFootageController from "@/controllers/admin/footage.controller";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dcdwbdzql",
  api_key: "916793923444751",
  api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class AdminFootageRoute implements Route {
  public path = "/api/v1/admin/footage";
  public router = Router();

  public adminFootageController = new AdminFootageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path + "/upload",
      // uploadFootageInput,

      authMiddleware,
      // upload.fields([
      //   { name: "video", maxCount: 1 },
      //   { name: "photo", maxCount: 1 },
      // ]),
      this.adminFootageController.uploadFootage
    );

    this.router.post(
      this.path + "/edit/:footageId",
      authMiddleware,
      // upload.fields([
      //   { name: "video", maxCount: 1 },
      //   { name: "photo", maxCount: 1 },
      // ]),
      this.adminFootageController.editFootage
    );

    this.router.get(
      this.path + "/private",
      authMiddleware,
      this.adminFootageController.getFootageAdmin
    );
    this.router.get(this.path, this.adminFootageController.getFootage);
    this.router.get(
      this.path + "/details/:id",
      this.adminFootageController.getSingleFootage
    );
    
    this.router.get(
      this.path + "/details-private/:id",
      authMiddleware,
      this.adminFootageController.getSingleFootagePrivate
    );

    this.router.delete(
      this.path + "/delete/:id",
      this.adminFootageController.deleteFootage
    );
  }
}

export default AdminFootageRoute;
