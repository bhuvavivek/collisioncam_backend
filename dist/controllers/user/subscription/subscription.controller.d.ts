import { RequestWithSubscription, RequestWithUser } from "../../../interfaces/auth.interface";
import { Response } from "express";
declare class SubscriptionController {
    requestSubscription(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteSubscription(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    getSubscription(req: RequestWithUser, res: Response): Promise<void>;
    getSingleSubscription(req: RequestWithUser, res: Response): Promise<void>;
    approveSubscription(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    handlePaymentSuccess(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    subscriptionLogin(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    subscriptionProfile(req: RequestWithSubscription, res: Response): Promise<void>;
    dowloadVideo(req: RequestWithSubscription, res: Response): Promise<Response<any, Record<string, any>>>;
    renewSubscription(req: RequestWithSubscription, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
    changeUsername(req: RequestWithUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default SubscriptionController;
