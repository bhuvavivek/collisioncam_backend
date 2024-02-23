import { body, param } from "express-validator";

export const adminRegisterInput = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .isLength({ min: 8 })
    .withMessage("Paasword should minimum 8 character"),
];

export const adminLoginInput = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const adminForgotInput = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

export const adminResetInput = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .isLength({ min: 8 })
    .withMessage("Paasword should minimum 8 character"),
];

export const adminChangeInput = [
  body("password").notEmpty().withMessage("Current Password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "New Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .isLength({ min: 8 })
    .withMessage("New Paasword should minimum 8 character"),

  body("newPassword").custom((value, { req }) => {
    if (value === req.body.password) {
      throw new Error("New Password and new password should be different");
    }
    return true;
  }),
];

export const adminGeneralInput = [
  body("phone")
    .optional()
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),

  body("email").optional().isEmail().withMessage("Invalid email address"),
];

export const uploadFootageInput = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price should be a numeric value"),
  body("id").notEmpty().withMessage("ID is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("thumbnail")
    .notEmpty()
    .withMessage("Thumbnail URL is required")
    .isURL()
    .withMessage("Thumbnail should be a valid URL"),
  body("thumbnailPublicKey")
    .notEmpty()
    .withMessage("Thumbnail Public Key is required"),
];

export const requestInput = [
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),
  body("footageName").notEmpty().withMessage("Footage name is required"),
  body("footageId").notEmpty().withMessage("Footage ID is required"),
  body("reason").notEmpty().withMessage("Reason is required"),
  body("partneredLawFirms")
    .notEmpty()
    .withMessage("Partnered law firms is required"),
];

export const requestUpdateInput = [
  body("status")
    .optional()
    .isIn(["approved", "reject", "pending"])
    .withMessage("Invalid status value"),
];

export const becomeAffliateInput = [
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("address")
    .notEmpty()
    .withMessage("Address is required"),
  body("phone")
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
export const subscriptionInput = [
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),
  body("website")
    .optional()
    .if(body("website").notEmpty())
    .isURL()
    .withMessage("Invalid URL format for website"),
];

export const subscriptionApprovedInput = [
  param("userId").isMongoId().withMessage("Invalid user ID"), 
];

export const affliateUpdateInput = [
  body("status")
    .optional()
    .isIn(["approved", "reject", "pending"])
    .withMessage("Invalid status value"),
];

export const sellInput = [
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),
  body("date").notEmpty().withMessage("Date is required"),
  body("location").notEmpty().withMessage("Location is required"),
];

export const partnerInput = [
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone")
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

export const notificationSettingsInput = [
  body("sellClaimRequest")
    .notEmpty()
    .withMessage("Sell Claim Request is required")
    .custom(isBoolean),

  body("affiliateRequest")
    .notEmpty()
    .withMessage("Affiliate Request is required")
    .custom(isBoolean),

  body("freeFootageRequest")
    .notEmpty()
    .withMessage("Free Footage Request is required")
    .custom(isBoolean),
];

export const requestSettingsInput = [
  body("commisionRate").notEmpty().withMessage("commision Rate is required"),

  body("affiliateTermsCondition")
    .notEmpty()
    .withMessage("Affiliate Terms & Condition is required"),

  body("sellClaimTermsCondition")
    .notEmpty()
    .withMessage("Sell Claim Terms Condition is required"),
];
