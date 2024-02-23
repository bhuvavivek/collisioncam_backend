import { Admin } from "../interfaces/admin.interface";
import { Document } from "mongoose";
declare const adminModel: import("mongoose").Model<Admin & Document<any, any, any>, {}, {}>;
export default adminModel;
