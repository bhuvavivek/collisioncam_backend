import { Capture } from "@/interfaces/capture.interface";
import { model, Schema, Document } from "mongoose";

const captureSchema: Schema = new Schema(
  {
    type: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const captureModel = model<Capture & Document>("capture", captureSchema);

export default captureModel;
