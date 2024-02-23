import { Subscription } from "../interfaces/subscription.interface";
import { Document } from "mongoose";
declare const subscriptionModel: import("mongoose").Model<Subscription & Document<any, any, any>, {}, {}>;
export default subscriptionModel;
