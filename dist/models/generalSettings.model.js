"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const generalSettingsSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const generalSettingsModel = mongoose_1.model("GeneralSettings", generalSettingsSchema);
exports.default = generalSettingsModel;
//# sourceMappingURL=generalSettings.model.js.map