import { Router } from "express";
import Route from "@/interfaces/routes.interface";
import GoogleController from "@/controllers/google/Google.controller";



class GoogleRoute implements Route {
  public path = "/api/v1/google";
  public router = Router();

  public googleController = new GoogleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
   

    this.router.get(
      this.path+'/reviews',
      this.googleController.getReviews
    );
  }
}

export default GoogleRoute;
