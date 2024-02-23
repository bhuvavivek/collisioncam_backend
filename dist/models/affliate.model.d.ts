import { Document } from "mongoose";
import { Affliate } from "../interfaces/affliate.interface";
declare const affliateModel: import("mongoose").Model<Affliate & Document<any, any, any>, {}, {}>;
export default affliateModel;
