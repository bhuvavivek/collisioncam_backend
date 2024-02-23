import { Request, Response } from "express";
import { RequestWithUser } from "../../interfaces/auth.interface";
declare class AdminAuthController {
    getProfile(req: RequestWithUser, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    generalSettings(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default AdminAuthController;
