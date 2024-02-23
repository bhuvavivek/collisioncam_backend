import { NextFunction, Response } from "express";
import { RequestWithSubscription } from "../interfaces/auth.interface";
declare const userMiddleware: (req: RequestWithSubscription, res: Response, next: NextFunction) => Promise<void>;
export default userMiddleware;
