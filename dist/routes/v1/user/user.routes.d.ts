import Route from "../../../interfaces/routes.interface";
import UserController from "../../../controllers/user/user.controller";
declare class UserRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    userController: UserController;
    constructor();
    private initializeRoutes;
}
export default UserRoute;
