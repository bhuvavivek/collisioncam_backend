import { Document } from 'mongoose';
import { Otp } from '../interfaces/otps.interface';
declare const otpModel: import("mongoose").Model<Otp & Document<any, any, any>, {}, {}>;
export default otpModel;
