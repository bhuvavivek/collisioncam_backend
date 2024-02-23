import { RequestWithSubscription } from "../interfaces/auth.interface";
import { NextFunction, Response } from "express";
declare const checkSubscriptionValidity: (req: RequestWithSubscription, res: Response, next: NextFunction) => void;
export default checkSubscriptionValidity;
