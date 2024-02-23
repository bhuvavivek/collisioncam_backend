import { uploadAndPushFile } from "@/bucket";
import {
  RequestWithSubscription,
  RequestWithUser,
} from "@/interfaces/auth.interface";
import subscriptionModel from "@/models/subscription.model";
import { Response } from "express";
import { validationResult } from "express-validator";
import MSG from "@utils/locale.en.json";
import sendMail from "@/utils/mail";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);
import { v4 as uuidv4 } from "uuid";
import cryptoRandomString from "crypto-random-string";
import jwt from "jsonwebtoken";
import footageModel from "@/models/foogate.model";
import {
  rejectedTemplete,
  renewSuccess,
  sendIdPassword,
  sendPayemntLinkTemplate,
  sendRenewLinkTemplate,
  sendSubmitionSuccess,
  subscriptionForm,
} from "@/email-template/Template";
import {
  PaymentDetails,
  UsernamePassword,
} from "@/interfaces/template.interface";
import paymentModel from "@/models/payment.model";
import {
  createRandomBytes,
  decodeSecretToken,
  encodeSecretToken,
} from "@/utils/helper";
import { isValidObjectId } from "mongoose";

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
    if (upper) types.push(getRandomChar(uppercaseLetters));
    if (lower) types.push(getRandomChar(lowercaseLetters));
    if (digit) types.push(getRandomChar(digits));
    if (special) types.push(getRandomChar(specialCharacters));

    return getRandomChar(types);
  };

  const passwordLength = 10;
  const password = Array.from({ length: passwordLength }, () => {
    return getRandomCharOfType(true, true, true, true);
  }).join("");

  return password;
}

interface UploadResponse {
  Location: string;
  Key: string;
  // Define other properties if available
}

class SubscriptionController {
  public async requestSubscription(req: RequestWithUser, res: Response) {
    try {
      const {
        email,
        full_name,
        phone,
        companyName,
        website,
        industry,
        address,
        promotionMethod,
        comments,
        aboutUs,
      } = req.body;
      const errors = validationResult(req);
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
      while (
        await subscriptionModel
          .findOne({ userId })
          .sort({ createdAt: -1 })
          .limit(1)
      ) {
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

      const existingSubscription = await subscriptionModel
        .findOne({ email })
        .sort({ createdAt: -1 })
        .limit(1);

      if (existingSubscription) {
        if (
          !existingSubscription.isDelete &&
          existingSubscription.status !== "pending"
        ) {
          return res
            .status(400)
            .json({ message: "Request already sent to admin" });
        }
      }

      const documents = [];
      if (req.files && (req?.files as { pdf?: any })?.pdf) {
        const pdfs = Array.isArray((req?.files as { pdf?: any })?.pdf)
          ? (req?.files as { pdf?: any })?.pdf
          : [(req?.files as { pdf?: any })?.pdf];

        console.log(pdfs);
        for (const pdf of pdfs) {
          const data = (await uploadAndPushFile(
            "subscription",
            pdf,
            "document.pdf",
            "A"
          )) as UploadResponse;
          documents.push({ url: data.Location, publicKey: data.Key });
        }
      }

      const newSubscription = new subscriptionModel({
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

      sendMail({
        to: email,
        html: sendSubmitionSuccess({ username: full_name }),
        title: "Thank You for Your Submission",
      });

      sendMail({
        to: "tate@collisioncam.org",
        html: subscriptionForm({
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
      sendMail({
        to: "info@collisioncam.org",
        html: subscriptionForm({
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async deleteSubscription(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      console.log(id);
      const subscription = await subscriptionModel.findByIdAndUpdate(
        id,
        { isDelete: true },
        { new: true }
      );
      if (!subscription)
        return res.status(404).json({ message: "Subscription not found" });

      res
        .status(200)
        .json({ success: true, message: "Subscription deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getSubscription(req: RequestWithUser, res: Response) {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Sorting parameters
      const sortField = (req.query.sortBy as string) || "createdAt";
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      // Date range filtering parameters
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      // Search by name parameter
      const searchName = req.query.name as string;

      // Filter by status parameter
      const status = req.query.status as string;

      // Build query based on parameters
      const query: any = {};

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
      const subscriptions = await subscriptionModel
        .find({ ...query, isDelete: { $ne: true } })
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

      // Count total records for pagination
      const totalRecords = await subscriptionModel.countDocuments(query);

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getSingleSubscription(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      const subscription = await subscriptionModel
        .findById(id)
        .select("-password");
      res.json({ result: subscription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async approveSubscription(req: RequestWithUser, res: Response) {
    try {
      const { amount, duration, status } = req.body;
      const { userId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      if (status === "rejected") {
        const userSubscription = await subscriptionModel.findByIdAndUpdate(
          userId,
          { status },
          { new: true }
        );

        if (!userSubscription)
          return res.status(404).json({ message: "Subscription not found" });

        sendMail({
          to: userSubscription.email,
          html: rejectedTemplete(),
          title: "Your subscription got rejected",
        });

        res.status(200).json({
          message: "Your subscription got rejected",
        });
      }

      const userSubscription = await subscriptionModel.findByIdAndUpdate(
        userId,
        { amount, duration, status },
        { new: true }
      );

      const payment = new paymentModel({
        name: userSubscription?.full_name,
        email: userSubscription?.email,
        amount: userSubscription?.amount,
        type: "Subscription",
      });

      const randomBytes = await createRandomBytes();

      const secretToken = encodeSecretToken(randomBytes, payment._id);
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
        success_url: `https://collisioncam.org/payment-success?secret=${secretToken}`, // Replace with your success URL
        cancel_url: "https://collisioncam.org/payment-rejected", // Replace with your cancel URL
        customer_email: userSubscription.email,
        client_reference_id: userSubscription.full_name,
      });

      const content: PaymentDetails = {
        amount: amount,
        duration: duration,
        paymentLink: session?.url,
        userName: userSubscription?.full_name,
      };

      sendMail({
        to: userSubscription.email,
        html: sendPayemntLinkTemplate(content),
        title:
          "Action Required: Complete Your Collision Cam Subscription Payment",
      });

      res.status(200).json({
        message: "Payment link send successfully",
        userSubscription,
        paymentLink: session.url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async handlePaymentSuccess(req: RequestWithUser, res: Response) {
    try {
      // // Extract userId and token from request parameters
      const { secretKey } = req.params;
      if (!secretKey) {
        res.status(400).json({ message: "Secret key not found" });
      }

      const { randomBytes, paymentId } = decodeSecretToken(secretKey);
      console.log("paymentid", paymentId);

      if (!isValidObjectId(paymentId)) {
        return res.status(400).json({ message: "Ivalid ID" });
      }

      const payment = await paymentModel.findById(paymentId);

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
      ?.map(
        (item: { name: string; video: string }) => `
    <strong>Product Name:</strong> ${item.name}<br>
    <strong>Video Link:</strong> <a href="${item.video}" target="_blank" class="download-button">Download</a><br>
    `
      )
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

        sendMail({
          to: email,
          html: message,
          title: "Order Purchase Successful - Download Your Footage Now!",
        });

        payment.secretkey = null;
        payment.status = "success";
        await payment.save();
      } else if (payment.type == "Subscription") {
        const userSubscription = await subscriptionModel
          .findOne({
            email: payment.email,
          })
          .sort({ createdAt: -1 })
          .limit(1);

        let expirationTimestamp;

        const currentDate = new Date(Date.now());

        if (
          !userSubscription.expireAt ||
          new Date(userSubscription.expireAt) <= currentDate
        ) {
          expirationTimestamp =
            Date.now() +
            Number(userSubscription?.duration) * 24 * 60 * 60 * 1000;
          console.log("new subscription");
        } else {
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
        const content: UsernamePassword = {
          username: userSubscription?.userId,
          password: userSubscription?.password,
        };

        if (
          !userSubscription.expireAt ||
          new Date(userSubscription.expireAt) <= currentDate
        ) {
          sendMail({
            to: userSubscription?.email,
            html: sendIdPassword(content),
            title:
              "Welcome to Collision Cam - Your Subscription is Now Active!",
          });
        } else {
          sendMail({
            to: userSubscription?.email,
            html: renewSuccess(content),
            title:
              "Welcome to Collision Cam - Your Subscription is renew successfully!",
          });
        }
      }

      res.status(200).json({ message: "Payment success handling complete" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async subscriptionLogin(req: RequestWithUser, res: Response) {
    try {
      // Extract userId and token from request parameters
      const { userId, password } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User id is required" });
      }

      if (!password) {
        return res.status(400).json({ error: "Password id is required" });
      }

      const existingUser = await subscriptionModel
        .findOne({ userId })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!existingUser)
        return res.status(402).json({ message: MSG.WORNG_CREDENTIAL });

      if (existingUser.isDelete)
        return res
          .status(402)
          .json({ message: "Your accound has been suspended" });

      let isMatched = existingUser?.password === password;

      if (!isMatched)
        return res.status(402).json({ message: MSG.WORNG_CREDENTIAL });

      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRECT,
        {
          expiresIn: "30d",
        }
      );

      existingUser.password = undefined;

      res.status(200).json({
        success: true,
        message: MSG.LOGIN_SUCCESS,
        token,
        user: existingUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async subscriptionProfile(
    req: RequestWithSubscription,
    res: Response
  ) {
    try {
      const user = req.user;
      const isValidSubscription = req.isValidSubscription;
      res.status(200).json({ success: true, user, isValidSubscription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async dowloadVideo(req: RequestWithSubscription, res: Response) {
    try {
      const isValidSubscription = req.isValidSubscription;
      if (!isValidSubscription)
        return res.status(402).json({ message: "Subscription has expired" });

      const { footageId } = req.params;
      if (!footageId) {
        return res.status(400).json({ message: "Footage Id id is required" });
      }

      const footage = await footageModel.findById(footageId);
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async renewSubscription(req: RequestWithSubscription, res: Response) {
    try {
      const user = req.user;

      if (user.status === "rejected") {
        return res.status(400).json({
          success: true,
          message: "Your subscription is rejected",
        });
      }

      const payment = new paymentModel({
        name: user?.full_name,
        email: user?.email,
        amount: user?.amount,
        type: "Subscription",
      });

      const randomBytes = await createRandomBytes();

      const secretToken = encodeSecretToken(randomBytes, payment._id);
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
        success_url: `https://collisioncam.org/payment-success?secret=${secretToken}`, // Replace with your success URL
        cancel_url: "https://collisioncam.org/payment-rejected", // Replace with your cancel URL
        customer_email: user?.email,
        client_reference_id: user?.full_name,
      });

      const content: PaymentDetails = {
        amount: user?.amount,
        duration: user?.duration,
        paymentLink: session?.url,
        userName: user?.full_name,
      };

      sendMail({
        to: user?.email,
        html: sendRenewLinkTemplate(content),
        title:
          "Action Required: Complete Your Collision Cam Subscription Renew Payment",
      });

      res.status(200).json({
        success: true,
        message: "Subscription renewed successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async changePassword(req: RequestWithUser, res: Response) {
    try {
      const { password, newPassword } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = await subscriptionModel.findById(req?.user?._id);

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async changeUsername(req: RequestWithUser, res: Response) {
    try {
      const { userId, newUserId } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingUser = await subscriptionModel.findById(req?.user?._id);

      if (!existingUser)
        return res.status(404).json({ message: "User not found" });

      const isSameCurrentUserId = userId === existingUser.userId;

      if (!isSameCurrentUserId)
        return res.status(401).json({ message: "Invalid user ID" });

      const userExistByNewUserID = await subscriptionModel.findOne({ userId: newUserId });


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
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default SubscriptionController;
