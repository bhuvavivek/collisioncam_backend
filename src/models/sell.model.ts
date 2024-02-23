import { model, Schema, Document } from "mongoose";
import { SellInterface } from "@/interfaces/sell.interface";

const sellSchema: Schema = new Schema(
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
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },

    reason: {
      type: String,
    },

    document: {
      type: String,
    },

    documentPublicKey: {
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

const sellModel = model<SellInterface & Document>("Sell", sellSchema);

export default sellModel;
