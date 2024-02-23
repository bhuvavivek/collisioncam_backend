import { Document } from "mongoose";
import { SellInterface } from "../interfaces/sell.interface";
declare const sellModel: import("mongoose").Model<SellInterface & Document<any, any, any>, {}, {}>;
export default sellModel;
