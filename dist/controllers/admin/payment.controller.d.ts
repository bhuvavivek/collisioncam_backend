import { RequestWithUser } from "../../interfaces/auth.interface";
import { Response } from "express";
declare class PaymentController {
    getPayment(req: RequestWithUser, res: Response): Promise<void>;
    getSinglePayment(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    deletePayment(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default PaymentController;
