import Route from "../interfaces/routes.interface";
declare class IndexRoute implements Route {
    path: string;
    router: import("express-serve-static-core").Router;
    constructor();
    private initializeRoutes;
}
export default IndexRoute;
