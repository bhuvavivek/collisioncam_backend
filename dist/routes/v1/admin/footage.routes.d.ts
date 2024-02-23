import Route from "../../../interfaces/routes.interface";
import AdminFootageController from "../../../controllers/admin/footage.controller";
declare class AdminFootageRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    adminFootageController: AdminFootageController;
    constructor();
    private initializeRoutes;
}
export default AdminFootageRoute;
