import Route from "../../../interfaces/routes.interface";
import GoogleController from "../../../controllers/google/Google.controller";
declare class GoogleRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    googleController: GoogleController;
    constructor();
    private initializeRoutes;
}
export default GoogleRoute;
