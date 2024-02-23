"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSettingsInput = exports.notificationSettingsInput = exports.partnerInput = exports.sellInput = exports.affliateUpdateInput = exports.subscriptionApprovedInput = exports.subscriptionInput = exports.becomeAffliateInput = exports.requestUpdateInput = exports.requestInput = exports.uploadFootageInput = exports.adminGeneralInput = exports.adminChangeInput = exports.adminResetInput = exports.adminForgotInput = exports.adminLoginInput = exports.adminRegisterInput = void 0;
const express_validator_1 = require("express-validator");
exports.adminRegisterInput = [
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    express_validator_1.body("password")
        .notEmpty()
        .withMessage("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
        .isLength({ min: 8 })
        .withMessage("Paasword should minimum 8 character"),
];
exports.adminLoginInput = [
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    express_validator_1.body("password").notEmpty().withMessage("Password is required"),
];
exports.adminForgotInput = [
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
];
exports.adminResetInput = [
    express_validator_1.body("password")
        .notEmpty()
        .withMessage("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage("Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
        .isLength({ min: 8 })
        .withMessage("Paasword should minimum 8 character"),
];
exports.adminChangeInput = [
    express_validator_1.body("password").notEmpty().withMessage("Current Password is required"),
    express_validator_1.body("newPassword")
        .notEmpty()
        .withMessage("New Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage("New Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
        .isLength({ min: 8 })
        .withMessage("New Paasword should minimum 8 character"),
    express_validator_1.body("newPassword").custom((value, { req }) => {
        if (value === req.body.password) {
            throw new Error("New Password and new password should be different");
        }
        return true;
    }),
];
exports.adminGeneralInput = [
    express_validator_1.body("phone")
        .optional()
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),
    express_validator_1.body("email").optional().isEmail().withMessage("Invalid email address"),
];
exports.uploadFootageInput = [
    express_validator_1.body("name").notEmpty().withMessage("Name is required"),
    express_validator_1.body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price should be a numeric value"),
    express_validator_1.body("id").notEmpty().withMessage("ID is required"),
    express_validator_1.body("state").notEmpty().withMessage("State is required"),
    express_validator_1.body("city").notEmpty().withMessage("City is required"),
    express_validator_1.body("date").notEmpty().withMessage("Date is required"),
    express_validator_1.body("time").notEmpty().withMessage("Time is required"),
    express_validator_1.body("thumbnail")
        .notEmpty()
        .withMessage("Thumbnail URL is required")
        .isURL()
        .withMessage("Thumbnail should be a valid URL"),
    express_validator_1.body("thumbnailPublicKey")
        .notEmpty()
        .withMessage("Thumbnail Public Key is required"),
];
exports.requestInput = [
    express_validator_1.body("full_name").notEmpty().withMessage("Full name is required"),
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    express_validator_1.body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),
    express_validator_1.body("footageName").notEmpty().withMessage("Footage name is required"),
    express_validator_1.body("footageId").notEmpty().withMessage("Footage ID is required"),
    express_validator_1.body("reason").notEmpty().withMessage("Reason is required"),
    express_validator_1.body("partneredLawFirms")
        .notEmpty()
        .withMessage("Partnered law firms is required"),
];
exports.requestUpdateInput = [
    express_validator_1.body("status")
        .optional()
        .isIn(["approved", "reject", "pending"])
        .withMessage("Invalid status value"),
];
exports.becomeAffliateInput = [
    express_validator_1.body("full_name").notEmpty().withMessage("Full name is required"),
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    express_validator_1.body("address")
        .notEmpty()
        .withMessage("Address is required"),
    express_validator_1.body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),
    // body("website")
    //   .optional()
    //   .if(body("website").notEmpty())
    //   .isURL()
    //   .withMessage("Invalid URL format for website"),
    // body("industry").notEmpty().withMessage("Industry is required"),
];
exports.subscriptionInput = [
    express_validator_1.body("full_name").notEmpty().withMessage("Full name is required"),
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    express_validator_1.body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),
    express_validator_1.body("website")
        .optional()
        .if(express_validator_1.body("website").notEmpty())
        .isURL()
        .withMessage("Invalid URL format for website"),
];
exports.subscriptionApprovedInput = [
    express_validator_1.param("userId").isMongoId().withMessage("Invalid user ID"),
];
exports.affliateUpdateInput = [
    express_validator_1.body("status")
        .optional()
        .isIn(["approved", "reject", "pending"])
        .withMessage("Invalid status value"),
];
exports.sellInput = [
    express_validator_1.body("full_name").notEmpty().withMessage("Full name is required"),
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    express_validator_1.body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),
    express_validator_1.body("date").notEmpty().withMessage("Date is required"),
    express_validator_1.body("location").notEmpty().withMessage("Location is required"),
];
exports.partnerInput = [
    express_validator_1.body("full_name").notEmpty().withMessage("Full name is required"),
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    express_validator_1.body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must contain only digits")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),
];
const isBoolean = (value) => {
    return typeof value === "boolean";
};
exports.notificationSettingsInput = [
    express_validator_1.body("sellClaimRequest")
        .notEmpty()
        .withMessage("Sell Claim Request is required")
        .custom(isBoolean),
    express_validator_1.body("affiliateRequest")
        .notEmpty()
        .withMessage("Affiliate Request is required")
        .custom(isBoolean),
    express_validator_1.body("freeFootageRequest")
        .notEmpty()
        .withMessage("Free Footage Request is required")
        .custom(isBoolean),
];
exports.requestSettingsInput = [
    express_validator_1.body("commisionRate").notEmpty().withMessage("commision Rate is required"),
    express_validator_1.body("affiliateTermsCondition")
        .notEmpty()
        .withMessage("Affiliate Terms & Condition is required"),
    express_validator_1.body("sellClaimTermsCondition")
        .notEmpty()
        .withMessage("Sell Claim Terms Condition is required"),
];
//# sourceMappingURL=inputValidation.js.map