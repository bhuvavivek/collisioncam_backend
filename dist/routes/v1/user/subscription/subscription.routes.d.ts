import Route from "../../../../interfaces/routes.interface";
import SubscriptionController from "../../../../controllers/user/subscription/subscription.controller";
declare class SubsriptionRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    subscriptionController: SubscriptionController;
    constructor();
    private initializeRoutes;
}
export default SubsriptionRoute;
