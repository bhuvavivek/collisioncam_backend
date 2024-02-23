import { Footage } from "@/interfaces/footage.interface";
import { model, Schema, Document } from "mongoose";

const footageSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },

    id: {
      type: String,
    },

    state: {
      type: String,
    },
    city: {
      type: String,
    },

    date: {
      type: String,
    },
    time: {
      type: String,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    thumbnailPublicKey: {
      type: String,
    },

    video: {
      type: String,
    },

    videoPublicKey: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const footageModel = model<Footage & Document>("Footage", footageSchema);

export default footageModel;
