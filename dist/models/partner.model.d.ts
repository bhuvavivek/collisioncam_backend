import { Document } from "mongoose";
import { PartnerInterface } from "../interfaces/partner.interface";
declare const partnerModel: import("mongoose").Model<PartnerInterface & Document<any, any, any>, {}, {}>;
export default partnerModel;
