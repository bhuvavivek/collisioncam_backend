import { Response } from "express";
import MSG from "@utils/locale.en.json";
import { validationResult } from "express-validator";
import { RequestWithUser } from "@/interfaces/auth.interface";
import footageModel from "@/models/foogate.model";
import requestModel from "@/models/request.model";
import affliateModel from "@/models/affliate.model";
import { isValidObjectId } from "mongoose";
import sellModel from "@/models/sell.model";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";
import {
  createRandomBytes,
  encodeSecretToken,
  getISOWeek,
} from "@/utils/helper";
import sendMail from "@/utils/mail";
import { uploadFile, uploadAndPushFile } from "../../bucket";
import partnerModel from "@/models/partner.model";
import captureModel from "@/models/capture.models";
import paymentModel from "@/models/payment.model";
import {
  ApproveTemplete,
  partnerForm,
  rejectTemplete,
  requestForFreeApproved,
  sendSubmitionSuccess,
  subscriptionForm,
} from "@/email-template/Template";
import subscriptionModel from "@/models/subscription.model";

const stripe = new Stripe(process.env.STRIPE_SECRET);

interface Filter {
  status: string;
  full_name: object;
  createdAt: object;
  type: string;
}

interface UploadResponse {
  Location: string;
  Key: string;
  // Define other properties if available
}

cloudinary.config({
  cloud_name: "dcdwbdzql",
  api_key: "916793923444751",
  api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});

class UserController {
  public async recentActivty(req: RequestWithUser, res: Response) {
    try {
      const partnerActivities = await partnerModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5);
      const paymentActivities = await paymentModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5);
      const subscriptionActivities = await subscriptionModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5);

      const recentActivity = partnerActivities
        .map((activity) => ({
          name: activity.full_name,
          email: activity.email,
          requestType: "Partner",
          createdAt: new Date(activity.createdAt),
          _id: activity._id,
        }))

        .concat(
          paymentActivities.map((activity) => ({
            name: activity.name,
            email: activity.email,
            requestType: activity?.type,
            createdAt: new Date(activity.createdAt),
            _id: activity._id,
          }))
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .concat(
          subscriptionActivities.map((activity) => ({
            name: activity.full_name,
            email: activity.email,
            requestType: "Subscription Request",
            createdAt: new Date(activity.createdAt),
            _id: activity._id,
          }))
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      res.status(200).json({
        success: true,
        message: "Send request successfully",
        result: recentActivity,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async footageSalesChart(req: RequestWithUser, res: Response) {
    try {
      const data = await paymentModel.find();

      // Initialize separate arrays for Subscription and Buy
      const subscriptionData = [];
      const buyData = [];

      // Use Map to store total amount for each period in buyData
      const buyDataMap = new Map();
      const subscriptionDataMap = new Map();

      data.forEach((item) => {
        const createdAt = item.createdAt;
        let key: string;
        const newDate = new Date(createdAt);

        if (req.query.type === "month") {
          key = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
        } else if (req.query.type === "week") {
          key = `${newDate.getFullYear()}-W${getISOWeek(newDate)}`;
        } else if (req.query.type === "day") {
          key = newDate.toISOString().split("T")[0];
        }

        const amount = parseFloat(item.amount as string);

        // Check the type and add to the corresponding array
        if (req.query.filter === "all" || req.query.filter === item.type) {
          if (item.type === "Subscription") {
            if (!subscriptionDataMap.has(key)) {
              subscriptionDataMap.set(key, 0);
            }
            subscriptionDataMap.set(key, subscriptionDataMap.get(key) + amount);
          } else if (item.type === "Buy") {
            if (!buyDataMap.has(key)) {
              buyDataMap.set(key, 0);
            }
            buyDataMap.set(key, buyDataMap.get(key) + amount);
          }
        }
      });

      // Generate the last 12 periods based on the query type
      const today = new Date();
      const last12Periods = Array.from({ length: 12 }).map((_, index) => {
        const periodDate = new Date(today);

        if (req.query.type === "month") {
          periodDate.setMonth(today.getMonth() - index);
          return `${periodDate.getFullYear()}-${(periodDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
        } else if (req.query.type === "week") {
          periodDate.setDate(today.getDate() - index * 7);
          return `${periodDate.getFullYear()}-W${getISOWeek(periodDate)}`;
        } else if (req.query.type === "day") {
          periodDate.setDate(today.getDate() - index);
          return periodDate.toISOString().split("T")[0];
        }
      });

      // Fill in the data for each period, including future periods with zero data
      last12Periods.forEach((period) => {
        buyData.push({
          period,
          totalAmount: buyDataMap.get(period) || 0,
        });

        subscriptionData.push({
          period,
          totalAmount: subscriptionDataMap.get(period) || 0,
        });
      });

      const maxBarWidth = 1;

      // Calculate gap between bars
      const gapBetweenBars = -0.5; // 5% gap

      // Calculate bar width based on the number of data points and gap
      const barWidth = Math.min((1 - gapBetweenBars) * maxBarWidth, 1 / 4);

      // Create the HTML response
      const script = `
        var ctx = document.getElementById('revenueChart').getContext('2d');
  
        var existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }
  
  
        var data = {
          labels: ${JSON.stringify(last12Periods)},
          datasets: [
            {
                label: 'Footage Sales',
                backgroundColor: '#29207e',
                data: ${JSON.stringify(
                  buyData.map((entry) => entry.totalAmount)
                )},
                borderRadius: {
                    topLeft: '999',
                    topRight: 999,
                },
                barPercentage: ${barWidth},
                categoryPercentage: 1,
            },
            {
                label: 'Subscription',
                backgroundColor: '#bf9853',
                data: ${JSON.stringify(
                  subscriptionData.map((entry) => entry.totalAmount)
                )},
                borderRadius: {
                    topLeft: 999,
                    topRight: 999,
                },
                barPercentage: ${barWidth},
                categoryPercentage: 1,
            }
        ]
        };
  
        var options = {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        };
  
        var myBarChart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
        });
      `;

      res.status(200).json({
        success: true,
        totalSubscription: subscriptionData,
        totalFootageSales: buyData,
        script,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async totalFootageSales(req: RequestWithUser, res: Response) {
    try {
      const totalFootageSaleAmount = await paymentModel.aggregate([
        { $match: { type: "Buy" } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $toDouble: "$amount" } },
          },
        },
      ]);

      const totalSubscriptionAmount = await paymentModel.aggregate([
        { $match: { type: "Subscription" } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $toDouble: "$amount" } },
          },
        },
      ]);

      if (
        totalFootageSaleAmount.length > 0 ||
        totalSubscriptionAmount.length > 0
      ) {
        res.status(200).json({
          success: true,
          message: "Fetch footage successfully",
          totalFootageSaleAmount: totalFootageSaleAmount[0]?.totalAmount || 0,
          totalSubscriptionAmount: totalSubscriptionAmount[0]?.totalAmount || 0,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Fetch footage successfully",
          totalFootageSaleAmount: 0,
          totalSubscriptionAmount: 0,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async sendRequest(req: RequestWithUser, res: Response) {
    try {
      const {
        full_name,
        email,
        phone,
        footageId,
        footageName,
        reason,
        partneredLawFirms,
        type,
        aboutUs,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const footage = await footageModel.findOne({ id: footageId });

      if (!footage)
        return res.status(404).json({ message: "This footage is unavailable" });

      const documents = [];
      if (req.files && (req?.files as { pdf?: any })?.pdf) {
        const pdfs = Array.isArray((req?.files as { pdf?: any })?.pdf)
          ? (req?.files as { pdf?: any })?.pdf
          : [(req?.files as { pdf?: any })?.pdf];
        for (const pdf of pdfs) {
          const data = (await uploadAndPushFile(
            "request",
            pdf,
            "document.pdf",
            "A"
          )) as UploadResponse;

          console.log(data);
          documents.push({ url: data.Location, publicKey: data.Key });
        }
      }

      // Check if 'pdf' property exists in req.files object

      const newRequest = new requestModel({
        full_name,
        email,
        phone,
        footageId,
        footageName,
        reason,
        partneredLawFirms,
        type,
        aboutUs,
        documents,
      });

      const sucessData = await newRequest.save();
      res.status(200).json({
        success: true,
        message: "Send request successfully",
        data: sucessData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getRequest(req: RequestWithUser, res: Response) {
    try {
      const {
        page = 1,
        limit,
        sortBy = "createdAt",
        order = "desc",
        status,
        search,
        startDate,
        endDate,
        type,
      } = req.query;

      // Build the filter object
      const filter = {} as Filter;
      if (status) {
        filter.status = status as string;
      }
      if (search) {
        filter.full_name = { $regex: new RegExp(search as string, "i") };
      }

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      if (type) {
        filter.type = type as string;
      }

      const totalCount = await requestModel.countDocuments(filter).exec();

      // Execute the query with pagination and sorting
      const result = await requestModel
        .find(filter)
        .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(parseInt(limit as string, 10))
        .exec();

      res.status(200).json({
        success: true,
        message: "Fetech request successfully",
        result,
        totalCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSingleRequest(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await requestModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      res.status(200).json({
        success: true,
        message: "Fetch single request successfully",
        result: request,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async testPdfUpload(req: RequestWithUser, res: Response) {
    try {
      const pdf = (req?.files as { pdf?: any })?.pdf;
      console.log(pdf, "this is ur request file");

      // Check if 'pdf' property exists in req.files object
      if (pdf) {
        const data = await uploadAndPushFile("pp", pdf, "dddd.pdf", "profile");
        console.log(data, "this is data");

        res.status(200).json({
          success: true,
          message: "Fetch single request successfully",
          result: data,
        });
      } else {
        // Handle the case when 'pdf' property is not found
        res.status(400).json({ message: "Invalid request format" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async updateRequest(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { status, description } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await requestModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      const updatedRequest = await requestModel.findByIdAndUpdate(
        id,
        { status, description },
        { new: true }
      );

      if (status === "approved") {
        const footage = await footageModel.findOne({ id: request?.footageId });

        sendMail({
          to: request?.email,
          html: requestForFreeApproved({
            link: footage?.video,
            username: request.full_name,
          }),
          title:
            "Congratulations! Your Collision Cam Request is Approved + Exclusive Video Access",
        });
      }

      if (status === "reject") {
        sendMail({
          to: request.email,
          html: rejectTemplete({
            type: "Partner Firm",
            username: request.full_name,
          }),
          title: "Collision Cam: Partnership Request Declined",
        });
      }

      res.status(200).json({
        success: true,
        message: "Update request successfully",
        result: updatedRequest,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async createCheckoutSession(req: RequestWithUser, res: Response) {
    try {
      const { products } = req.body;
      console.log("into products", products);
      console.log(process.env.STRIPE_SECRET);

      const totalAmount = products.reduce((sum, product) => {
        return sum + product.price * 100; // Assuming product.price is the price of the product
      }, 0);

      const lineItems = products.map((product: any) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.images], // Assuming product.images is a URL or an array of URLs
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1, // You can adjust the quantity as needed
        };
      });

      const randomBytes = await createRandomBytes();

      const footages = await Promise.all(
        products.map(async (product: { id: string }) => {
          const footage = await footageModel.findById(product.id);
          // You can perform any transformation or filtering here
          return footage;
        })
      );

      const payment = new paymentModel({
        name: products[0]?.user_name,
        email: products[0]?.user_email,
        amount: totalAmount / 100,
        type: "Buy",
        products: footages.map((product: any) => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          video: product.video,
          description: product.description,
          // Add any other fields related to a product
        })),
      });

      const secretToken = encodeSecretToken(randomBytes, payment._id);
      payment.secretkey = secretToken;

      await payment.save();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url:
          "https://collisioncam.org/payment-success?secret=" + secretToken, // Replace with your success URL
        cancel_url: "https://collisioncam.org/payment-rejected", // Replace with your cancel URL
        customer_email: products[0]?.user_email,
        client_reference_id: products[0]?.user_name,
      });

      res.status(200).json({
        success: true,
        sessionId: session.id, // Send the session ID to the client for redirecting
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async deleteRequest(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await requestModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      await requestModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Request delete successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async becomeAffliate(req: RequestWithUser, res: Response) {
    try {
      const {
        email,
        full_name,
        phone,
        companyName,
        website,
        industry,
        document,
        experience,
        promotionMethod,
        address,
        comments,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const existingAffliate = await affliateModel
        .findOne({ email })
        .sort({ createdAt: -1 })
        .limit(1);

      if (existingAffliate && existingAffliate?.status === "pending")
        return res
          .status(400)
          .json({ message: "Request already send to admin" });

      const documents = [];
      if (req.files && (req?.files as { pdf?: any })?.pdf) {
        const pdfs = Array.isArray((req?.files as { pdf?: any })?.pdf)
          ? (req?.files as { pdf?: any })?.pdf
          : [(req?.files as { pdf?: any })?.pdf];
        for (const pdf of pdfs) {
          const data = (await uploadAndPushFile(
            "affiliate",
            pdf,
            "document.pdf",
            "A"
          )) as UploadResponse;

          console.log(data);
          documents.push({ url: data.Location, publicKey: data.Key });
        }
      }

      const newAffliate = new affliateModel({
        email,
        full_name,
        phone,
        companyName,
        website,
        industry,
        document,
        experience,
        promotionMethod,
        comments,
        address,
        documents,
      });

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
          promotionMethod,
          comments,
        }),
        title: "New Form Submission - Action Required",
      });

      await newAffliate.save();

      res.status(200).json({
        success: true,
        message: "Affliate request send successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getAffliate(req: RequestWithUser, res: Response) {
    try {
      const {
        page = 1,
        limit,
        sortBy = "createdAt",
        order = "desc",
        status,
        search,
        startDate,
        endDate,
      } = req.query;

      const filter = {} as Filter;
      if (status) {
        filter.status = status as string;
      }
      if (search) {
        filter.full_name = { $regex: new RegExp(search as string, "i") };
      }
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      // Execute the query with pagination and sorting
      const result = await affliateModel
        .find(filter)
        .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(parseInt(limit as string, 10))
        .select({ companyName: 0, website: 0, industry: 0, experience: 0 })
        .exec(); // Execute the query to get the actual results

      // Execute a separate count query
      const totalCount = await affliateModel.countDocuments(filter).exec();

      res.status(200).json({
        success: true,
        message: "Fetch affliate successfully",
        totalCount,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSingleAffliate(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await affliateModel
        .findById(id)
        .select("-companyName -website -industry -experience");
      if (!request)
        return res.status(404).json({ message: "Affliate not found" });

      res.status(200).json({
        success: true,
        message: "Fetch single affliate successfully",
        result: request,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async updateAffliate(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { status, description, affliate_id } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await affliateModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Affliate not found" });

      const updatedAffliate = await affliateModel.findByIdAndUpdate(
        id,
        { status, description, affliate_id },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Update affliate successfully",
        result: updatedAffliate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getAffiliatePerformance(req: RequestWithUser, res: Response) {
    try {
      const {
        page = 1,
        limit,
        sortBy = "createdAt",
        order = "desc",
        status,
        search,
        startDate,
        endDate,
      } = req.query;

      const filter = {} as Filter;
      if (status) {
        filter.status = status as string;
      }
      if (search) {
        filter.full_name = { $regex: new RegExp(search as string, "i") };
      }
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      // Execute the query with pagination and sorting
      const result = await affliateModel
        .find(filter)
        .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(parseInt(limit as string, 10))
        .exec(); // Execute the query to get the actual results

      // Execute a separate count query
      const totalCount = await affliateModel.countDocuments(filter).exec();

      res.status(200).json({
        success: true,
        message: "Fetch affliate performance successfully",
        totalCount,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async deleteAffliate(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await affliateModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Affliate not found" });

      await affliateModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Affliate delete successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async sellClaim(req: RequestWithUser, res: Response) {
    try {
      const {
        full_name,
        email,
        phone,
        date,
        location,
        description,
        referenceNumber,
        reason,
        document,
      } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }
      const documents = [];
      if (req.files && (req?.files as { pdf?: any })?.pdf) {
        const pdfs = Array.isArray((req?.files as { pdf?: any })?.pdf)
          ? (req?.files as { pdf?: any })?.pdf
          : [(req?.files as { pdf?: any })?.pdf];
        for (const pdf of pdfs) {
          const data = (await uploadAndPushFile(
            "sellClaim",
            pdf,
            "document.pdf",
            "SC"
          )) as UploadResponse;

          console.log(data);
          documents.push({ url: data.Location, publicKey: data.Key });
        }
      }

      const newSellClaim = new sellModel({
        full_name,
        email,
        phone,
        date,
        location,
        description,
        referenceNumber,
        reason,
        documents,
      });

      await newSellClaim.save();
      res.status(200).json({
        success: true,
        message: "Sell and claim send successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSellClaim(req: RequestWithUser, res: Response) {
    try {
      const {
        page = 1,
        limit,
        sortBy = "createdAt",
        order = "desc",
        status,
        search,
        startDate,
        endDate,
      } = req.query;

      const filter = {} as Filter;
      if (status) {
        filter.status = status as string;
      }
      if (search) {
        filter.full_name = { $regex: new RegExp(search as string, "i") };
      }
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      const result = await sellModel
        .find(filter)
        .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(parseInt(limit as string, 10))
        .exec(); // Execute the query to get the actual results

      // Execute a separate count query
      const totalCount = await sellModel.countDocuments(filter).exec();

      res.status(200).json({
        success: true,
        message: "Fetch sell and claim send successfully",
        totalCount,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSingleSellClaim(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const sell = await sellModel.findById(id);
      if (!sell)
        return res.status(404).json({ message: "Sell claim not found" });

      res.status(200).json({
        success: true,
        message: "Fetch single sell and claim successfully",
        result: sell,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async updateSellClaim(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { status, description, affliate_id } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await sellModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Sell and claim not found" });

      const updatedSell = await sellModel.findByIdAndUpdate(
        id,
        { status, description, affliate_id },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Update sell and claim successfully",
        result: updatedSell,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async deleteSellClaim(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await sellModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Sell and claim not found" });

      await sellModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Sell and claim delete successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async partnerFirms(req: RequestWithUser, res: Response) {
    try {
      const { full_name, email, phone, address, comment, promotion, aboutUs } =
        req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      const documents = [];
      if (req.files && (req?.files as { pdf?: any })?.pdf) {
        const pdfs = Array.isArray((req?.files as { pdf?: any })?.pdf)
          ? (req?.files as { pdf?: any })?.pdf
          : [(req?.files as { pdf?: any })?.pdf];
        for (const pdf of pdfs) {
          const data = (await uploadAndPushFile(
            "Partner firms",
            pdf,
            "document.pdf",
            "PF"
          )) as UploadResponse;

          console.log(data);
          documents.push({ url: data.Location, publicKey: data.Key });
        }
      }
      const newPartnerFirms = new partnerModel({
        full_name,
        email,
        phone,
        address,
        comment,
        promotion,
        aboutUs,
        documents,
      });

      sendMail({
        to: email,
        html: sendSubmitionSuccess({ username: full_name }),
        title: "Thank You for Your Submission",
      });

      sendMail({
        to: "tate@collisioncam.org",
        html: partnerForm({
          full_name,
          email,
          phone,
          address,
          comment,
          promotion,
        }),
        title: "New Form Submission - Action Required",
      });
      sendMail({
        to: "info@collisioncam.org",
        html: partnerForm({
          full_name,
          email,
          phone,
          address,
          comment,
          promotion,
        }),
        title: "New Form Submission - Action Required",
      });

      await newPartnerFirms.save();
      res.status(200).json({
        success: true,
        message: "Success",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getPartnerFirms(req: RequestWithUser, res: Response) {
    try {
      const {
        page = 1,
        limit,
        sortBy = "createdAt",
        order = "desc",
        status,
        search,
        startDate,
        endDate,
      } = req.query;

      const filter = {} as Filter;
      if (status) {
        filter.status = status as string;
      }
      if (search) {
        filter.full_name = { $regex: new RegExp(search as string, "i") };
      }
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      const result = await partnerModel
        .find(filter)
        .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(parseInt(limit as string, 10))
        .exec(); // Execute the query to get the actual results

      // Execute a separate count query
      const totalCount = await partnerModel.countDocuments(filter).exec();

      res.status(200).json({
        success: true,
        message: "Fetch partner firms send successfully",
        totalCount,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getSinglePartnerFirm(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const partner = await partnerModel.findById(id);
      if (!partner)
        return res.status(404).json({ message: "Partner firms not found" });

      res.status(200).json({
        success: true,
        message: "Fetch single partner firms successfully",
        result: partner,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async updatePartnerfirm(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { status, description, affliate_id } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: errors.array()[0]?.msg });
      }

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await partnerModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Partner not found" });

      if (status === "approved") {
        sendMail({
          to: request.email,
          html: ApproveTemplete({
            type: "Partner Firm",
            username: request.full_name,
          }),
          title: "Welcome to Collision Cam: Partnership Approved!",
        });
      }

      if (status === "reject") {
        sendMail({
          to: request.email,
          html: rejectTemplete({
            type: "Partner Firm",
            username: request.full_name,
          }),
          title: "Collision Cam: Partnership Request Declined",
        });
      }

      const updatedSell = await partnerModel.findByIdAndUpdate(
        id,
        { status, description, affliate_id },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Update partner successfully",
        result: updatedSell,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async deletePartnerfirm(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return res.status(401).json({ message: "Invalid id" });

      const request = await partnerModel.findById(id);
      if (!request)
        return res.status(404).json({ message: "Partner not found" });

      await partnerModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Partner delete successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async getCapture(req: RequestWithUser, res: Response) {
    try {
      const allCaptures = await captureModel.find();

      res.status(200).json({
        success: true,
        message: "fetch successfully",
        result: allCaptures,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async addCapture(req: RequestWithUser, res: Response) {
    try {
      const { type, value } = req.body;

      if (!type) {
        return res.status(400).json({ message: "Type is required" });
      }

      // Check if the type already exists
      const existingCapture = await captureModel.findOne({ type });

      if (existingCapture) {
        return res.status(400).json({ message: "Type must be unique" });
      }

      const newCapture = await captureModel.create({ type, value });

      res.status(200).json({
        success: true,
        message: "Added successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }

  public async updateCapture(req: RequestWithUser, res: Response) {
    try {
      const { value, type } = req.body;

      // Check if the provided type is one of the allowed values
      const allowedTypes = ["Collisions", "Hit-and-runs", "Client-connection"];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid capture type" });
      }

      // Update only the 'value' field
      const updatedCapture = await captureModel.findOneAndUpdate(
        { type: type },
        { value },
        { new: true }
      );

      if (!updatedCapture) {
        return res.status(404).json({ message: "Capture not found" });
      }

      res.status(200).json({
        success: true,
        message: "Updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: MSG.SERVER_ERROR });
    }
  }
}

export default UserController;
