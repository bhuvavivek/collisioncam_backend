"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bucket_1 = require("../../../bucket");
const subscription_model_1 = tslib_1.__importDefault(require("../../../models/subscription.model"));
const express_validator_1 = require("express-validator");
const locale_en_json_1 = tslib_1.__importDefault(require("../../../utils/locale.en.json"));
const mail_1 = tslib_1.__importDefault(require("../../../utils/mail"));
const stripe_1 = tslib_1.__importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const foogate_model_1 = tslib_1.__importDefault(require("../../../models/foogate.model"));
const Template_1 = require("../../../email-template/Template");
const payment_model_1 = tslib_1.__importDefault(require("../../../models/payment.model"));
const helper_1 = require("../../../utils/helper");
const mongoose_1 = require("mongoose");
function generatePassword() {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specialCharacters = "!@#$%^&*()_-+=<>?";
    const getRandomChar = (characters) => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    };
    const getRandomCharOfType = (upper, lower, digit, special) => {
        const types = [];
        if (upper)
            types.push(getRandomChar(uppercaseLetters));
        if (lower)
            types.push(getRandomChar(lowercaseLetters));
        if (digit)
            types.push(getRandomChar(digits));
        if (special)
            types.push(getRandomChar(specialCharacters));
        return getRandomChar(types);
    };
    const passwordLength = 10;
    const password = Array.from({ length: passwordLength }, () => {
        return getRandomCharOfType(true, true, true, true);
    }).join("");
    return password;
}
class SubscriptionController {
    async requestSubscription(req, res) {
        try {
            const { email, full_name, phone, companyName, website, industry, address, promotionMethod, comments, aboutUs, } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const generateUserId = () => {
                const firstTwoLetters = "CC";
                const firstLetter = full_name[0].toUpperCase();
                const lastLetter = full_name[full_name.length - 1].toUpperCase();
                const phoneChars = phone.slice(-2);
                const randomNumbers = Math.floor(100 + Math.random() * 900);
                const shuffledNumbers = randomNumbers
                    .toString()
                    .split("")
                    .sort(() => 0.5 - Math.random())
                    .join("");
                return `${firstTwoLetters}${firstLetter}${lastLetter}${phoneChars}${shuffledNumbers}`;
            };
            let userId = generateUserId();
            let attempt = 1;
            // Regenerate userId if it already exists
            while (await subscription_model_1.default
                .findOne({ userId })
                .sort({ createdAt: -1 })
                .limit(1)) {
                userId = generateUserId();
                attempt++;
                // To prevent infinite loop, consider limiting the number of attempts
                if (attempt > 5) {
                    return res
                        .status(500)
                        .json({ message: "Unable to generate a unique userId" });
                }
            }
            // Generate unique password
            const password = generatePassword();
            const existingSubscription = await subscription_model_1.default
                .findOne({ email })
                .sort({ createdAt: -1 })
                .limit(1);
            if (existingSubscription) {
                if (!existingSubscription.isDelete &&
                    existingSubscription.status !== "pending") {
                    return res
                        .status(400)
                        .json({ message: "Request already sent to admin" });
                }
            }
            const documents = [];
            if (req.files && req?.files?.pdf) {
                const pdfs = Array.isArray(req?.files?.pdf)
                    ? req?.files?.pdf
                    : [req?.files?.pdf];
                console.log(pdfs);
                for (const pdf of pdfs) {
                    const data = (await bucket_1.uploadAndPushFile("subscription", pdf, "document.pdf", "A"));
                    documents.push({ url: data.Location, publicKey: data.Key });
                }
            }
            const newSubscription = new subscription_model_1.default({
                email,
                full_name,
                phone,
                companyName,
                website,
                industry,
                address,
                promotionMethod,
                comments,
                userId,
                password,
                aboutUs,
                documents,
            });
            await newSubscription.save();
            mail_1.default({
                to: email,
                html: Template_1.sendSubmitionSuccess({ username: full_name }),
                title: "Thank You for Your Submission",
            });
            mail_1.default({
                to: "tate@collisioncam.org",
                html: Template_1.subscriptionForm({
                    email,
                    full_name,
                    phone,
                    companyName,
                    website,
                    industry,
                    address,
                    promotionMethod,
                    comments,
                }),
                title: "New Form Submission - Action Required",
            });
            mail_1.default({
                to: "info@collisioncam.org",
                html: Template_1.subscriptionForm({
                    email,
                    full_name,
                    phone,
                    companyName,
                    website,
                    industry,
                    address,
                    promotionMethod,
                    comments,
                }),
                title: "New Form Submission - Action Required",
            });
            res.status(200).json({
                success: true,
                message: "Subscription request sent successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async deleteSubscription(req, res) {
        try {
            const { id } = req.params;
            console.log(id);
            const subscription = await subscription_model_1.default.findByIdAndUpdate(id, { isDelete: true }, { new: true });
            if (!subscription)
                return res.status(404).json({ message: "Subscription not found" });
            res
                .status(200)
                .json({ success: true, message: "Subscription deleted successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async getSubscription(req, res) {
        try {
            // Pagination parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Sorting parameters
            const sortField = req.query.sortBy || "createdAt";
            const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
            // Date range filtering parameters
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            // Search by name parameter
            const searchName = req.query.name;
            // Filter by status parameter
            const status = req.query.status;
            // Build query based on parameters
            const query = {};
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            if (searchName) {
                query.full_name = { $regex: new RegExp(searchName, "i") }; // Case-insensitive search
            }
            if (status) {
                query.status = status;
            }
            // Fetch data with pagination, sorting, and filtering
            const subscriptions = await subscription_model_1.default
                .find({ ...query, isDelete: { $ne: true } })
                .sort({ [sortField]: sortOrder })
                .skip((page - 1) * limit)
                .limit(limit);
            // Count total records for pagination
            const totalRecords = await subscription_model_1.default.countDocuments(query);
            // Return response
            res.json({
                subscriptions,
                pageInfo: {
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / limit),
                    currentPage: page,
                    pageSize: limit,
                },
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async getSingleSubscription(req, res) {
        try {
            const { id } = req.params;
            const subscription = await subscription_model_1.default
                .findById(id)
                .select("-password");
            res.json({ result: subscription });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async approveSubscription(req, res) {
        try {
            const { amount, duration, status } = req.body;
            const { userId } = req.params;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            if (status === "rejected") {
                const userSubscription = await subscription_model_1.default.findByIdAndUpdate(userId, { status }, { new: true });
                if (!userSubscription)
                    return res.status(404).json({ message: "Subscription not found" });
                mail_1.default({
                    to: userSubscription.email,
                    html: Template_1.rejectedTemplete(),
                    title: "Your subscription got rejected",
                });
                res.status(200).json({
                    message: "Your subscription got rejected",
                });
            }
            const userSubscription = await subscription_model_1.default.findByIdAndUpdate(userId, { amount, duration, status }, { new: true });
            const payment = new payment_model_1.default({
                name: userSubscription?.full_name,
                email: userSubscription?.email,
                amount: userSubscription?.amount,
                type: "Subscription",
            });
            const randomBytes = await helper_1.createRandomBytes();
            const secretToken = helper_1.encodeSecretToken(randomBytes, payment._id);
            payment.secretkey = secretToken;
            await payment.save();
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Subscription",
                                images: [], // Assuming product.images is a URL or an array of URLs
                            },
                            unit_amount: Math.round(Number(amount) * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `https://collisioncam.org/payment-success?secret=${secretToken}`,
                cancel_url: "https://collisioncam.org/payment-rejected",
                customer_email: userSubscription.email,
                client_reference_id: userSubscription.full_name,
            });
            const content = {
                amount: amount,
                duration: duration,
                paymentLink: session?.url,
                userName: userSubscription?.full_name,
            };
            mail_1.default({
                to: userSubscription.email,
                html: Template_1.sendPayemntLinkTemplate(content),
                title: "Action Required: Complete Your Collision Cam Subscription Payment",
            });
            res.status(200).json({
                message: "Payment link send successfully",
                userSubscription,
                paymentLink: session.url,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async handlePaymentSuccess(req, res) {
        try {
            // // Extract userId and token from request parameters
            const { secretKey } = req.params;
            if (!secretKey) {
                res.status(400).json({ message: "Secret key not found" });
            }
            const { randomBytes, paymentId } = helper_1.decodeSecretToken(secretKey);
            console.log("paymentid", paymentId);
            if (!mongoose_1.isValidObjectId(paymentId)) {
                return res.status(400).json({ message: "Ivalid ID" });
            }
            const payment = await payment_model_1.default.findById(paymentId);
            if (!payment) {
                return res.status(400).json({ message: "Not found" });
            }
            if (!payment?.secretkey) {
                return res.status(400).json({ message: "Session Expired" });
            }
            if (payment.type == "Buy") {
                const email = payment.email;
                const message = `
        <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333333;
    }

    p {
      color: #555555;
    }

    .download-button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }

    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #888888;
    }

    .download-button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }

  </style>
</head>
<body>
  <div class="container">
    <h1>Dear ${payment.name},</h1>
    <p>We're thrilled to inform you that your recent order has been successfully processed, and your payment has been received. Thank you for choosing Collision Cam for your footage needs!</p>
    <p>To access and download your purchased footage, simply click on the link below:</p>
    ${payment?.products
                    ?.map((item) => `
    <strong>Product Name:</strong> ${item.name}<br>
    <strong>Video Link:</strong> <a href="${item.video}" target="_blank" class="download-button">Download</a><br>
    `)
                    .join("")}
        
      <p>Your order details:</p>
      <ul>
        <li><strong>Total Amount:</strong> ${Number(payment.amount) / 100}</li>
      </ul>
      <p>If you have any questions or encounter any issues while downloading, please don't hesitate to contact our customer support team.</p>
      <p>We appreciate your business and look forward to serving you again in the future.</p>
      <p class="footer">Best regards,<br>Collision Cam Team</p>
    </div>
  </body>
  </html>
  
      `;
                mail_1.default({
                    to: email,
                    html: message,
                    title: "Order Purchase Successful - Download Your Footage Now!",
                });
                payment.secretkey = null;
                payment.status = "success";
                await payment.save();
            }
            else if (payment.type == "Subscription") {
                const userSubscription = await subscription_model_1.default
                    .findOne({
                    email: payment.email,
                })
                    .sort({ createdAt: -1 })
                    .limit(1);
                let expirationTimestamp;
                const currentDate = new Date(Date.now());
                if (!userSubscription.expireAt ||
                    new Date(userSubscription.expireAt) <= currentDate) {
                    expirationTimestamp =
                        Date.now() +
                            Number(userSubscription?.duration) * 24 * 60 * 60 * 1000;
                    console.log("new subscription");
                }
                else {
                    var expireCurrentTimestamp = new Date(userSubscription.expireAt);
                    expirationTimestamp =
                        expireCurrentTimestamp.getTime() +
                            Number(userSubscription?.duration) * 24 * 60 * 60 * 1000;
                    console.log("renew");
                }
                userSubscription.expireAt = new Date(expirationTimestamp).toISOString();
                await userSubscription.save();
                payment.expireAt = new Date(expirationTimestamp).toISOString();
                payment.secretkey = null;
                payment.status = "success";
                await payment.save();
                const content = {
                    username: userSubscription?.userId,
                    password: userSubscription?.password,
                };
                if (!userSubscription.expireAt ||
                    new Date(userSubscription.expireAt) <= currentDate) {
                    mail_1.default({
                        to: userSubscription?.email,
                        html: Template_1.sendIdPassword(content),
                        title: "Welcome to Collision Cam - Your Subscription is Now Active!",
                    });
                }
                else {
                    mail_1.default({
                        to: userSubscription?.email,
                        html: Template_1.renewSuccess(content),
                        title: "Welcome to Collision Cam - Your Subscription is renew successfully!",
                    });
                }
            }
            res.status(200).json({ message: "Payment success handling complete" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async subscriptionLogin(req, res) {
        try {
            // Extract userId and token from request parameters
            const { userId, password } = req.body;
            if (!userId) {
                return res.status(400).json({ error: "User id is required" });
            }
            if (!password) {
                return res.status(400).json({ error: "Password id is required" });
            }
            const existingUser = await subscription_model_1.default
                .findOne({ userId })
                .sort({ createdAt: -1 })
                .limit(1);
            if (!existingUser)
                return res.status(402).json({ message: locale_en_json_1.default.WORNG_CREDENTIAL });
            if (existingUser.isDelete)
                return res
                    .status(402)
                    .json({ message: "Your accound has been suspended" });
            let isMatched = existingUser?.password === password;
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
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async subscriptionProfile(req, res) {
        try {
            const user = req.user;
            const isValidSubscription = req.isValidSubscription;
            res.status(200).json({ success: true, user, isValidSubscription });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async dowloadVideo(req, res) {
        try {
            const isValidSubscription = req.isValidSubscription;
            if (!isValidSubscription)
                return res.status(402).json({ message: "Subscription has expired" });
            const { footageId } = req.params;
            if (!footageId) {
                return res.status(400).json({ message: "Footage Id id is required" });
            }
            const footage = await foogate_model_1.default.findById(footageId);
            if (!footage)
                return res.status(404).json({ message: "Footage is not found" });
            res.status(200).json({
                success: true,
                footage: {
                    video: footage?.video || "",
                    thumbnail: footage?.thumbnail,
                },
                message: "Video link send successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async renewSubscription(req, res) {
        try {
            const user = req.user;
            if (user.status === "rejected") {
                return res.status(400).json({
                    success: true,
                    message: "Your subscription is rejected",
                });
            }
            const payment = new payment_model_1.default({
                name: user?.full_name,
                email: user?.email,
                amount: user?.amount,
                type: "Subscription",
            });
            const randomBytes = await helper_1.createRandomBytes();
            const secretToken = helper_1.encodeSecretToken(randomBytes, payment._id);
            payment.secretkey = secretToken;
            await payment.save();
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Subscription",
                                images: [], // Assuming product.images is a URL or an array of URLs
                            },
                            unit_amount: Math.round(Number(user?.amount) * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `https://collisioncam.org/payment-success?secret=${secretToken}`,
                cancel_url: "https://collisioncam.org/payment-rejected",
                customer_email: user?.email,
                client_reference_id: user?.full_name,
            });
            const content = {
                amount: user?.amount,
                duration: user?.duration,
                paymentLink: session?.url,
                userName: user?.full_name,
            };
            mail_1.default({
                to: user?.email,
                html: Template_1.sendRenewLinkTemplate(content),
                title: "Action Required: Complete Your Collision Cam Subscription Renew Payment",
            });
            res.status(200).json({
                success: true,
                message: "Subscription renewed successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async changePassword(req, res) {
        try {
            const { password, newPassword } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = await subscription_model_1.default.findById(req?.user?._id);
            if (!existingUser)
                return res.status(404).json({ message: "User not found" });
            const isSameCurrentPassword = password === existingUser.password;
            if (!isSameCurrentPassword)
                return res.status(401).json({ message: "Invalid password" });
            existingUser.password = newPassword;
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
    async changeUsername(req, res) {
        try {
            const { userId, newUserId } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingUser = await subscription_model_1.default.findById(req?.user?._id);
            if (!existingUser)
                return res.status(404).json({ message: "User not found" });
            const isSameCurrentUserId = userId === existingUser.userId;
            if (!isSameCurrentUserId)
                return res.status(401).json({ message: "Invalid user ID" });
            const userExistByNewUserID = await subscription_model_1.default.findOne({ userId: newUserId });
            if (userExistByNewUserID)
                return res.status(400).json({ message: "User name already taken" });
            existingUser.userId = newUserId;
            await existingUser.save();
            existingUser.password = undefined;
            res.json({
                success: true,
                message: "Username change successfully",
                existingUser,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
}
exports.default = SubscriptionController;
//# sourceMappingURL=subscription.controller.js.map