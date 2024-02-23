"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import userService from "@services/users.service";
const locale_en_json_1 = tslib_1.__importDefault(require("../../utils/locale.en.json"));
const admin_model_1 = tslib_1.__importDefault(require("../../models/admin.model"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const resetToken_model_1 = tslib_1.__importDefault(require("../../models/resetToken.model"));
const helper_1 = require("../../utils/helper");
const mail_1 = tslib_1.__importDefault(require("../../utils/mail"));
const Template_1 = require("../../email-template/Template");
class AdminAuthController {
    // get profile
    async getProfile(req, res) {
        try {
            const user = req.user;
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = (await admin_model_1.default.findOne({ email }));
            if (!existingUser)
                return res.status(402).json({ message: locale_en_json_1.default.WORNG_CREDENTIAL });
            const isMatched = bcryptjs_1.default.compareSync(password, existingUser?.password);
            console.log(isMatched);
            if (!isMatched)
                return res.status(402).json({ message: locale_en_json_1.default.WORNG_CREDENTIAL });
            const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, process.env.JWT_SECRECT, {
                expiresIn: "30d",
            });
            existingUser.password = undefined;
            res.status(200).json({
                success: true,
                message: locale_en_json_1.default.LOGIN_SUCCESS,
                token,
                user: existingUser,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Register
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = await admin_model_1.default.findOne({ email });
            if (existingUser)
                return res.status(402).json({ message: locale_en_json_1.default.USER_EXIST });
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(password, salt);
            const user = new admin_model_1.default({
                email,
                password: hash,
            });
            await user.save();
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRECT, {
                expiresIn: "30d",
            });
            res
                .status(200)
                .json({ success: true, message: locale_en_json_1.default.SIGNUP_SUCCESS, token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = (await admin_model_1.default.findOne({ email }));
            if (!existingUser)
                return res
                    .status(402)
                    .json({ message: locale_en_json_1.default.EMAIL_NOT_FOUND.replace("%email%", email) });
            const randomBytes = await helper_1.createRandomBytes();
            const token = await resetToken_model_1.default.findOne({ user: existingUser?._id });
            if (token) {
                await resetToken_model_1.default.findByIdAndDelete(token._id);
            }
            const resetToken = new resetToken_model_1.default({
                user: existingUser._id,
                token: randomBytes,
            });
            await resetToken.save();
            const url = `https://password.collisioncam.org/reset-password?token=${randomBytes}&id=${existingUser._id}`;
            mail_1.default({
                to: email,
                html: Template_1.forgotpasswordTemplete({ url }),
                title: "Password Reset Request Confirmation",
            });
            res.status(200).json({
                success: true,
                message: "Reset token send to " + email + " this mail",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Resete Password
    async resetPassword(req, res) {
        try {
            const { password } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = await admin_model_1.default.findById(req.user);
            if (!existingUser)
                return res.status(404).json({ message: "User not found" });
            const isSamePassword = await bcryptjs_1.default.compare(password, existingUser.password);
            if (isSamePassword)
                return res
                    .status(401)
                    .json({ message: "New password must be different!" });
            const salt = bcryptjs_1.default.genSaltSync(10);
            existingUser.password = bcryptjs_1.default.hashSync(password, salt);
            await existingUser.save();
            await resetToken_model_1.default.findOneAndDelete({ user: existingUser._id });
            res.json({
                success: true,
                message: "Password reset successfully",
                existingUser,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Change password
    async changePassword(req, res) {
        try {
            const { password, newPassword } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = await admin_model_1.default.findById(req?.user?._id);
            if (!existingUser)
                return res.status(404).json({ message: "User not found" });
            const isSameCurrentPassword = await bcryptjs_1.default.compare(password, existingUser.password);
            if (!isSameCurrentPassword)
                return res.status(401).json({ message: "Invalid password" });
            const salt = bcryptjs_1.default.genSaltSync(10);
            existingUser.password = bcryptjs_1.default.hashSync(newPassword, salt);
            await existingUser.save();
            existingUser.password = undefined;
            res.json({
                success: true,
                message: "Password change successfully",
                existingUser,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // General Settings
    async generalSettings(req, res) {
        try {
            const { phone, email, address } = req.body;
            if (!phone && !email && !address)
                return res
                    .status(404)
                    .json({ message: "Atleast one feilds is required" });
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = await admin_model_1.default.findById(req?.user?._id);
            if (!existingUser)
                return res.status(401).json({ message: "Invalid user" });
            if (phone)
                existingUser.phone = phone;
            if (email)
                existingUser.email = email;
            if (address)
                existingUser.address = address;
            await existingUser.save();
            existingUser.password = undefined;
            res.json({
                success: true,
                message: "General setting changed successfully",
                existingUser,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
}
exports.default = AdminAuthController;
//# sourceMappingURL=auth.controller.js.map