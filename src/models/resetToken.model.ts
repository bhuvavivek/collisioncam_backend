import { model, Schema, Document } from "mongoose";
import { ResetPass } from "@/interfaces/resetPass.interface";

const resetPassSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resetPassSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });

const resetPassModel = model<ResetPass & Document>("ResetPass", resetPassSchema);

export default resetPassModel;
