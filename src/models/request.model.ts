import { model, Schema, Document } from "mongoose";
import { RequestInterface } from "@/interfaces/request.interface";

const documentSchema = new Schema({
  url: String,
  publicKey: String
});

const requestSchema: Schema = new Schema(
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

    footageName: {
      type: String,
      required: true,
    },

    footageId: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    partneredLawFirms: {
      type: String,
      required: true,
    },

    documents: [documentSchema],

    aboutUs: {
      type: String,
    },

    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const requestModel = model<RequestInterface & Document>(
  "Request",
  requestSchema
);

export default requestModel;
