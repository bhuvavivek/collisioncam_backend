import { Capture } from "../interfaces/capture.interface";
import { Document } from "mongoose";
declare const captureModel: import("mongoose").Model<Capture & Document<any, any, any>, {}, {}>;
export default captureModel;
