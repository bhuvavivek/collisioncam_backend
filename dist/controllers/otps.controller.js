"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = tslib_1.__importDefault(require("../exceptions/HttpException"));
const otps_service_1 = tslib_1.__importDefault(require("../services/otps.service"));
// import userService from "@services/users.service";
const locale_en_json_1 = tslib_1.__importDefault(require("../utils/locale.en.json"));
class OtpsController {
    otpService = new otps_service_1.default();
    // public userService = new userService();
    verifyOtp = async (req, res, next) => {
        try {
            const otpData = req.body;
            const findOneOtpData = await this.otpService.verifyOtp(otpData);
            if (!findOneOtpData)
                throw new HttpException_1.default(409, locale_en_json_1.default.OTP_EXPIRED);
            // const findOneUserData: User =
            // 	await this.userService.findUserByMobile(findOneOtpData.mobile);
            res.status(200).json({
                data: "",
                message: locale_en_json_1.default.OTP_VERIFY_SUCCESS,
            });
        }
        catch (error) {
            next(error);
        }
    };
    createOtp = async (req, res, next) => {
        try {
            res.status(201).json({
                data: "",
                message: locale_en_json_1.default.OTP_SENT_SUCCESS,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = OtpsController;
//# sourceMappingURL=otps.controller.js.map