import Route from "../interfaces/routes.interface";
declare class AuthRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    constructor();
    private initializeRoutes;
    private getProfile;
}
export default AuthRoute;
