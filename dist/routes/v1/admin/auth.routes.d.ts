import Route from "../../../interfaces/routes.interface";
import AdminAuthController from "../../../controllers/admin/auth.controller";
declare class AdminAuthRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    adminAuthController: AdminAuthController;
    constructor();
    private initializeRoutes;
}
export default AdminAuthRoute;
