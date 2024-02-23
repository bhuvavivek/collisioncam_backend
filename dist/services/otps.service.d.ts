/// <reference types="mongoose" />
import { CreateOtpDto } from "../dtos/otps.dto";
import { Otp } from "../interfaces/otps.interface";
declare class OtpService {
    otps: import("mongoose").Model<Otp & import("mongoose").Document<any, any, any>, {}, {}>;
    createOtp(otpData: CreateOtpDto): Promise<Otp>;
    verifyOtp(otpData: any): Promise<Otp>;
}
export default OtpService;
