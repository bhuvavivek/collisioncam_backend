import { model, Schema, Document } from "mongoose";
import { PartnerInterface } from "@/interfaces/partner.interface";

const documentSchema = new Schema({
  url: String,
  publicKey: String
});


const partnerSchema: Schema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    promotion: {
      type: String,
    },
    comment: {
      type: String,
    },

    documents: [documentSchema],
    affliate_id: {
      type: String,
    },
    description: {
      type: String,
    },

    aboutUs: {
      type: String,
    },

    status: {
      type: String,
      enum: ["approved", "reject", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const partnerModel = model<PartnerInterface & Document>(
  "Partner",
  partnerSchema
);

export default partnerModel;
