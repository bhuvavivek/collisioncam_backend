import { Document } from "mongoose";
import { ResetPass } from "../interfaces/resetPass.interface";
declare const resetPassModel: import("mongoose").Model<ResetPass & Document<any, any, any>, {}, {}>;
export default resetPassModel;
