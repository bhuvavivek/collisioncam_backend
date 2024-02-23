import { NextFunction, Request, Response } from "express";
import otpService from "../services/otps.service";
declare class OtpsController {
    otpService: otpService;
    verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default OtpsController;
