import { Request, Response } from "express";
import { RequestWithUser } from "../../interfaces/auth.interface";
declare class generalSettingsController {
    getGeneralSettings(req: RequestWithUser, res: Response): Promise<void>;
    getFootage(req: Request, res: Response): Promise<void>;
    notificationSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    requestSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default generalSettingsController;
