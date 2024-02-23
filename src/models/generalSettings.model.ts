import { Admin } from "@/interfaces/admin.interface";
import { GeneralSettings } from "@/interfaces/generalSettings.interface";
import { model, Schema, Document } from "mongoose";

const generalSettingsSchema: Schema = new Schema(
  {
    commisionRate: {
      type: String,
    },
    affiliateTermsCondition: {
      type: String,
    },
    sellClaimTermsCondition: {
      type: String,
    },

    sellClaimRequest: {
      type: Boolean,
      default: false,
    },
    affiliateRequest: {
      type: Boolean,
      default: false,
    },
    freeFootageRequest: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const generalSettingsModel = model<GeneralSettings & Document>(
  "GeneralSettings",
  generalSettingsSchema
);

export default generalSettingsModel;
