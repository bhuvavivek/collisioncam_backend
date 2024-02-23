import { Document } from "mongoose";
import { PaymentInterface } from "../interfaces/payment.interface";
declare const paymentModel: import("mongoose").Model<PaymentInterface & Document<any, any, any>, {}, {}>;
export default paymentModel;
