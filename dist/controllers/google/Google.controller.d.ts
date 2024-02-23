import { RequestWithUser } from "../../interfaces/auth.interface";
import { Response } from "express";
declare class GoogleController {
    getReviews(req: RequestWithUser, res: Response): Promise<void>;
}
export default GoogleController;
