import { Admin } from "@/interfaces/admin.interface";
import { model, Schema, Document } from "mongoose";

const adminSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },

    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const adminModel = model<Admin & Document>("Admin", adminSchema);

export default adminModel;
