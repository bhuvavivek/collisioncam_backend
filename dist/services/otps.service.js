"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = tslib_1.__importDefault(require("../exceptions/HttpException"));
const otps_model_1 = tslib_1.__importDefault(require("../models/otps.model"));
const util_1 = require("../utils/util");
const locale_en_json_1 = tslib_1.__importDefault(require("../utils/locale.en.json"));
class OtpService {
    otps = otps_model_1.default;
    async createOtp(otpData) {
        if (util_1.isEmpty(otpData))
            throw new HttpException_1.default(400, locale_en_json_1.default.FIELDS_MISSING);
        await this.otps.deleteOne({ mobile: otpData.mobile });
        const createOtpData = await this.otps.create(otpData);
        return createOtpData;
    }
    async verifyOtp(otpData) {
        if (util_1.isEmpty(otpData._id) || util_1.isEmpty(otpData.otp))
            throw new HttpException_1.default(400, locale_en_json_1.default.FIELDS_MISSING);
        const findOtp = await this.otps.findOne({
            _id: otpData._id,
            otp: otpData.otp,
        });
        if (!findOtp)
            throw new HttpException_1.default(409, locale_en_json_1.default.OTP_EXPIRED);
        return findOtp;
    }
}
exports.default = OtpService;
//# sourceMappingURL=otps.service.js.map