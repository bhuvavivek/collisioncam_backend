import { Document } from "mongoose";
import { RequestInterface } from "../interfaces/request.interface";
declare const requestModel: import("mongoose").Model<RequestInterface & Document<any, any, any>, {}, {}>;
export default requestModel;
