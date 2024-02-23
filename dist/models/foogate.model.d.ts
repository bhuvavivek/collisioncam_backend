import { Footage } from "../interfaces/footage.interface";
import { Document } from "mongoose";
declare const footageModel: import("mongoose").Model<Footage & Document<any, any, any>, {}, {}>;
export default footageModel;
