import { NextFunction, Response } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
declare const validatedTokenMiddleware: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default validatedTokenMiddleware;
