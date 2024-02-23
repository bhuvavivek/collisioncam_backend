import { Request, Response } from "express";
import { RequestWithUser } from "../../interfaces/auth.interface";
declare class AdminFootageController {
    uploadFootage(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    editFootage(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    getFootageAdmin(req: Request, res: Response): Promise<void>;
    getFootage(req: Request, res: Response): Promise<void>;
    getSingleFootage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSingleFootagePrivate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteFootage(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default AdminFootageController;
