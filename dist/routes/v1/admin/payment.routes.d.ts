import PaymentController from "../../../controllers/admin/payment.controller";
import Route from "../../../interfaces/routes.interface";
declare class paymentRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    payment: PaymentController;
    constructor();
    private initializeRoutes;
}
export default paymentRoute;
