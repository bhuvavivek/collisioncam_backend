import Route from "../../../interfaces/routes.interface";
import generalSettingsController from "../../../controllers/admin/generalSettings.controller";
declare class generalSettingsRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    generalSettings: generalSettingsController;
    constructor();
    private initializeRoutes;
}
export default generalSettingsRoute;
