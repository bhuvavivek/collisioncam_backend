import PaymentController from "@/controllers/admin/payment.controller";
import Route from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import { Router } from "express";

class paymentRoute implements Route {
  public path = "/api/v1/payment";
  public router = Router();

  public payment = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path + "/", authMiddleware, this.payment.getPayment);
    this.router.get(this.path + "/details/:id", authMiddleware, this.payment.getSinglePayment);
    this.router.delete(this.path + "/delete/:id", authMiddleware, this.payment.deletePayment);
  }
}

export default paymentRoute;
