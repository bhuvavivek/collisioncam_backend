"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const locale_en_json_1 = tslib_1.__importDefault(require("../../utils/locale.en.json"));
const express_validator_1 = require("express-validator");
const foogate_model_1 = tslib_1.__importDefault(require("../../models/foogate.model"));
const request_model_1 = tslib_1.__importDefault(require("../../models/request.model"));
const affliate_model_1 = tslib_1.__importDefault(require("../../models/affliate.model"));
const mongoose_1 = require("mongoose");
const sell_model_1 = tslib_1.__importDefault(require("../../models/sell.model"));
const cloudinary_1 = require("cloudinary");
const stripe_1 = tslib_1.__importDefault(require("stripe"));
const helper_1 = require("../../utils/helper");
const mail_1 = tslib_1.__importDefault(require("../../utils/mail"));
const bucket_1 = require("../../bucket");
const partner_model_1 = tslib_1.__importDefault(require("../../models/partner.model"));
const capture_models_1 = tslib_1.__importDefault(require("../../models/capture.models"));
const payment_model_1 = tslib_1.__importDefault(require("../../models/payment.model"));
const Template_1 = require("../../email-template/Template");
const subscription_model_1 = tslib_1.__importDefault(require("../../models/subscription.model"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
cloudinary_1.v2.config({
    cloud_name: "dcdwbdzql",
    api_key: "916793923444751",
    api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});
class UserController {
    async recentActivty(req, res) {
        try {
            const partnerActivities = await partner_model_1.default
                .find()
                .sort({ createdAt: -1 })
                .limit(5);
            const paymentActivities = await payment_model_1.default
                .find()
                .sort({ createdAt: -1 })
                .limit(5);
            const subscriptionActivities = await subscription_model_1.default
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
                .concat(paymentActivities.map((activity) => ({
                name: activity.name,
                email: activity.email,
                requestType: activity?.type,
                createdAt: new Date(activity.createdAt),
                _id: activity._id,
            })))
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5)
                .concat(subscriptionActivities.map((activity) => ({
                name: activity.full_name,
                email: activity.email,
                requestType: "Subscription Request",
                createdAt: new Date(activity.createdAt),
                _id: activity._id,
            })))
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5);
            res.status(200).json({
                success: true,
                message: "Send request successfully",
                result: recentActivity,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async footageSalesChart(req, res) {
        try {
            const data = await payment_model_1.default.find();
            // Initialize separate arrays for Subscription and Buy
            const subscriptionData = [];
            const buyData = [];
            // Use Map to store total amount for each period in buyData
            const buyDataMap = new Map();
            const subscriptionDataMap = new Map();
            data.forEach((item) => {
                const createdAt = item.createdAt;
                let key;
                const newDate = new Date(createdAt);
                if (req.query.type === "month") {
                    key = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}`;
                }
                else if (req.query.type === "week") {
                    key = `${newDate.getFullYear()}-W${helper_1.getISOWeek(newDate)}`;
                }
                else if (req.query.type === "day") {
                    key = newDate.toISOString().split("T")[0];
                }
                const amount = parseFloat(item.amount);
                // Check the type and add to the corresponding array
                if (req.query.filter === "all" || req.query.filter === item.type) {
                    if (item.type === "Subscription") {
                        if (!subscriptionDataMap.has(key)) {
                            subscriptionDataMap.set(key, 0);
                        }
                        subscriptionDataMap.set(key, subscriptionDataMap.get(key) + amount);
                    }
                    else if (item.type === "Buy") {
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
                }
                else if (req.query.type === "week") {
                    periodDate.setDate(today.getDate() - index * 7);
                    return `${periodDate.getFullYear()}-W${helper_1.getISOWeek(periodDate)}`;
                }
                else if (req.query.type === "day") {
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
                data: ${JSON.stringify(buyData.map((entry) => entry.totalAmount))},
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
                data: ${JSON.stringify(subscriptionData.map((entry) => entry.totalAmount))},
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async totalFootageSales(req, res) {
        try {
            const totalFootageSaleAmount = await payment_model_1.default.aggregate([
                { $match: { type: "Buy" } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: { $toDouble: "$amount" } },
                    },
                },
            ]);
            const totalSubscriptionAmount = await payment_model_1.default.aggregate([
                { $match: { type: "Subscription" } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: { $toDouble: "$amount" } },
                    },
                },
            ]);
            if (totalFootageSaleAmount.length > 0 ||
                totalSubscriptionAmount.length > 0) {
                res.status(200).json({
                    success: true,
                    message: "Fetch footage successfully",
                    totalFootageSaleAmount: totalFootageSaleAmount[0]?.totalAmount || 0,
                    totalSubscriptionAmount: totalSubscriptionAmount[0]?.totalAmount || 0,
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    message: "Fetch footage successfully",
                    totalFootageSaleAmount: 0,
                    totalSubscriptionAmount: 0,
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async sendRequest(req, res) {
        try {
            const { full_name, email, phone, footageId, footageName, reason, partneredLawFirms, type, aboutUs, } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const footage = await foogate_model_1.default.findOne({ id: footageId });
            if (!footage)
                return res.status(404).json({ message: "This footage is unavailable" });
            const documents = [];
            if (req.files && req?.files?.pdf) {
                const pdfs = Array.isArray(req?.files?.pdf)
                    ? req?.files?.pdf
                    : [req?.files?.pdf];
                for (const pdf of pdfs) {
                    const data = (await bucket_1.uploadAndPushFile("request", pdf, "document.pdf", "A"));
                    console.log(data);
                    documents.push({ url: data.Location, publicKey: data.Key });
                }
            }
            // Check if 'pdf' property exists in req.files object
            const newRequest = new request_model_1.default({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getRequest(req, res) {
        try {
            const { page = 1, limit, sortBy = "createdAt", order = "desc", status, search, startDate, endDate, type, } = req.query;
            // Build the filter object
            const filter = {};
            if (status) {
                filter.status = status;
            }
            if (search) {
                filter.full_name = { $regex: new RegExp(search, "i") };
            }
            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            if (type) {
                filter.type = type;
            }
            const totalCount = await request_model_1.default.countDocuments(filter).exec();
            // Execute the query with pagination and sorting
            const result = await request_model_1.default
                .find(filter)
                .sort({ [sortBy]: order === "asc" ? 1 : -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(parseInt(limit, 10))
                .exec();
            res.status(200).json({
                success: true,
                message: "Fetech request successfully",
                result,
                totalCount,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSingleRequest(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await request_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Request not found" });
            res.status(200).json({
                success: true,
                message: "Fetch single request successfully",
                result: request,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async testPdfUpload(req, res) {
        try {
            const pdf = req?.files?.pdf;
            console.log(pdf, "this is ur request file");
            // Check if 'pdf' property exists in req.files object
            if (pdf) {
                const data = await bucket_1.uploadAndPushFile("pp", pdf, "dddd.pdf", "profile");
                console.log(data, "this is data");
                res.status(200).json({
                    success: true,
                    message: "Fetch single request successfully",
                    result: data,
                });
            }
            else {
                // Handle the case when 'pdf' property is not found
                res.status(400).json({ message: "Invalid request format" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async updateRequest(req, res) {
        try {
            const { id } = req.params;
            const { status, description } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await request_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Request not found" });
            const updatedRequest = await request_model_1.default.findByIdAndUpdate(id, { status, description }, { new: true });
            if (status === "approved") {
                const footage = await foogate_model_1.default.findOne({ id: request?.footageId });
                mail_1.default({
                    to: request?.email,
                    html: Template_1.requestForFreeApproved({
                        link: footage?.video,
                        username: request.full_name,
                    }),
                    title: "Congratulations! Your Collision Cam Request is Approved + Exclusive Video Access",
                });
            }
            if (status === "reject") {
                mail_1.default({
                    to: request.email,
                    html: Template_1.rejectTemplete({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async createCheckoutSession(req, res) {
        try {
            const { products } = req.body;
            console.log("into products", products);
            console.log(process.env.STRIPE_SECRET);
            const totalAmount = products.reduce((sum, product) => {
                return sum + product.price * 100; // Assuming product.price is the price of the product
            }, 0);
            const lineItems = products.map((product) => {
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
            const randomBytes = await helper_1.createRandomBytes();
            const footages = await Promise.all(products.map(async (product) => {
                const footage = await foogate_model_1.default.findById(product.id);
                // You can perform any transformation or filtering here
                return footage;
            }));
            const payment = new payment_model_1.default({
                name: products[0]?.user_name,
                email: products[0]?.user_email,
                amount: totalAmount / 100,
                type: "Buy",
                products: footages.map((product) => ({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    video: product.video,
                    description: product.description,
                    // Add any other fields related to a product
                })),
            });
            const secretToken = helper_1.encodeSecretToken(randomBytes, payment._id);
            payment.secretkey = secretToken;
            await payment.save();
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: "https://collisioncam.org/payment-success?secret=" + secretToken,
                cancel_url: "https://collisioncam.org/payment-rejected",
                customer_email: products[0]?.user_email,
                client_reference_id: products[0]?.user_name,
            });
            res.status(200).json({
                success: true,
                sessionId: session.id, // Send the session ID to the client for redirecting
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async deleteRequest(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await request_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Request not found" });
            await request_model_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Request delete successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async becomeAffliate(req, res) {
        try {
            const { email, full_name, phone, companyName, website, industry, document, experience, promotionMethod, address, comments, } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const existingAffliate = await affliate_model_1.default
                .findOne({ email })
                .sort({ createdAt: -1 })
                .limit(1);
            if (existingAffliate && existingAffliate?.status === "pending")
                return res
                    .status(400)
                    .json({ message: "Request already send to admin" });
            const documents = [];
            if (req.files && req?.files?.pdf) {
                const pdfs = Array.isArray(req?.files?.pdf)
                    ? req?.files?.pdf
                    : [req?.files?.pdf];
                for (const pdf of pdfs) {
                    const data = (await bucket_1.uploadAndPushFile("affiliate", pdf, "document.pdf", "A"));
                    console.log(data);
                    documents.push({ url: data.Location, publicKey: data.Key });
                }
            }
            const newAffliate = new affliate_model_1.default({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getAffliate(req, res) {
        try {
            const { page = 1, limit, sortBy = "createdAt", order = "desc", status, search, startDate, endDate, } = req.query;
            const filter = {};
            if (status) {
                filter.status = status;
            }
            if (search) {
                filter.full_name = { $regex: new RegExp(search, "i") };
            }
            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            // Execute the query with pagination and sorting
            const result = await affliate_model_1.default
                .find(filter)
                .sort({ [sortBy]: order === "asc" ? 1 : -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(parseInt(limit, 10))
                .select({ companyName: 0, website: 0, industry: 0, experience: 0 })
                .exec(); // Execute the query to get the actual results
            // Execute a separate count query
            const totalCount = await affliate_model_1.default.countDocuments(filter).exec();
            res.status(200).json({
                success: true,
                message: "Fetch affliate successfully",
                totalCount,
                result,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSingleAffliate(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await affliate_model_1.default
                .findById(id)
                .select("-companyName -website -industry -experience");
            if (!request)
                return res.status(404).json({ message: "Affliate not found" });
            res.status(200).json({
                success: true,
                message: "Fetch single affliate successfully",
                result: request,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async updateAffliate(req, res) {
        try {
            const { id } = req.params;
            const { status, description, affliate_id } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await affliate_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Affliate not found" });
            const updatedAffliate = await affliate_model_1.default.findByIdAndUpdate(id, { status, description, affliate_id }, { new: true });
            res.status(200).json({
                success: true,
                message: "Update affliate successfully",
                result: updatedAffliate,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getAffiliatePerformance(req, res) {
        try {
            const { page = 1, limit, sortBy = "createdAt", order = "desc", status, search, startDate, endDate, } = req.query;
            const filter = {};
            if (status) {
                filter.status = status;
            }
            if (search) {
                filter.full_name = { $regex: new RegExp(search, "i") };
            }
            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            // Execute the query with pagination and sorting
            const result = await affliate_model_1.default
                .find(filter)
                .sort({ [sortBy]: order === "asc" ? 1 : -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(parseInt(limit, 10))
                .exec(); // Execute the query to get the actual results
            // Execute a separate count query
            const totalCount = await affliate_model_1.default.countDocuments(filter).exec();
            res.status(200).json({
                success: true,
                message: "Fetch affliate performance successfully",
                totalCount,
                result,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async deleteAffliate(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await affliate_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Affliate not found" });
            await affliate_model_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Affliate delete successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async sellClaim(req, res) {
        try {
            const { full_name, email, phone, date, location, description, referenceNumber, reason, document, } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const documents = [];
            if (req.files && req?.files?.pdf) {
                const pdfs = Array.isArray(req?.files?.pdf)
                    ? req?.files?.pdf
                    : [req?.files?.pdf];
                for (const pdf of pdfs) {
                    const data = (await bucket_1.uploadAndPushFile("sellClaim", pdf, "document.pdf", "SC"));
                    console.log(data);
                    documents.push({ url: data.Location, publicKey: data.Key });
                }
            }
            const newSellClaim = new sell_model_1.default({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSellClaim(req, res) {
        try {
            const { page = 1, limit, sortBy = "createdAt", order = "desc", status, search, startDate, endDate, } = req.query;
            const filter = {};
            if (status) {
                filter.status = status;
            }
            if (search) {
                filter.full_name = { $regex: new RegExp(search, "i") };
            }
            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            const result = await sell_model_1.default
                .find(filter)
                .sort({ [sortBy]: order === "asc" ? 1 : -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(parseInt(limit, 10))
                .exec(); // Execute the query to get the actual results
            // Execute a separate count query
            const totalCount = await sell_model_1.default.countDocuments(filter).exec();
            res.status(200).json({
                success: true,
                message: "Fetch sell and claim send successfully",
                totalCount,
                result,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSingleSellClaim(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const sell = await sell_model_1.default.findById(id);
            if (!sell)
                return res.status(404).json({ message: "Sell claim not found" });
            res.status(200).json({
                success: true,
                message: "Fetch single sell and claim successfully",
                result: sell,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async updateSellClaim(req, res) {
        try {
            const { id } = req.params;
            const { status, description, affliate_id } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await sell_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Sell and claim not found" });
            const updatedSell = await sell_model_1.default.findByIdAndUpdate(id, { status, description, affliate_id }, { new: true });
            res.status(200).json({
                success: true,
                message: "Update sell and claim successfully",
                result: updatedSell,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async deleteSellClaim(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await sell_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Sell and claim not found" });
            await sell_model_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Sell and claim delete successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async partnerFirms(req, res) {
        try {
            const { full_name, email, phone, address, comment, promotion, aboutUs } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const documents = [];
            if (req.files && req?.files?.pdf) {
                const pdfs = Array.isArray(req?.files?.pdf)
                    ? req?.files?.pdf
                    : [req?.files?.pdf];
                for (const pdf of pdfs) {
                    const data = (await bucket_1.uploadAndPushFile("Partner firms", pdf, "document.pdf", "PF"));
                    console.log(data);
                    documents.push({ url: data.Location, publicKey: data.Key });
                }
            }
            const newPartnerFirms = new partner_model_1.default({
                full_name,
                email,
                phone,
                address,
                comment,
                promotion,
                aboutUs,
                documents,
            });
            mail_1.default({
                to: email,
                html: Template_1.sendSubmitionSuccess({ username: full_name }),
                title: "Thank You for Your Submission",
            });
            mail_1.default({
                to: "tate@collisioncam.org",
                html: Template_1.partnerForm({
                    full_name,
                    email,
                    phone,
                    address,
                    comment,
                    promotion,
                }),
                title: "New Form Submission - Action Required",
            });
            mail_1.default({
                to: "info@collisioncam.org",
                html: Template_1.partnerForm({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getPartnerFirms(req, res) {
        try {
            const { page = 1, limit, sortBy = "createdAt", order = "desc", status, search, startDate, endDate, } = req.query;
            const filter = {};
            if (status) {
                filter.status = status;
            }
            if (search) {
                filter.full_name = { $regex: new RegExp(search, "i") };
            }
            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            const result = await partner_model_1.default
                .find(filter)
                .sort({ [sortBy]: order === "asc" ? 1 : -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(parseInt(limit, 10))
                .exec(); // Execute the query to get the actual results
            // Execute a separate count query
            const totalCount = await partner_model_1.default.countDocuments(filter).exec();
            res.status(200).json({
                success: true,
                message: "Fetch partner firms send successfully",
                totalCount,
                result,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSinglePartnerFirm(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const partner = await partner_model_1.default.findById(id);
            if (!partner)
                return res.status(404).json({ message: "Partner firms not found" });
            res.status(200).json({
                success: true,
                message: "Fetch single partner firms successfully",
                result: partner,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async updatePartnerfirm(req, res) {
        try {
            const { id } = req.params;
            const { status, description, affliate_id } = req.body;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await partner_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Partner not found" });
            if (status === "approved") {
                mail_1.default({
                    to: request.email,
                    html: Template_1.ApproveTemplete({
                        type: "Partner Firm",
                        username: request.full_name,
                    }),
                    title: "Welcome to Collision Cam: Partnership Approved!",
                });
            }
            if (status === "reject") {
                mail_1.default({
                    to: request.email,
                    html: Template_1.rejectTemplete({
                        type: "Partner Firm",
                        username: request.full_name,
                    }),
                    title: "Collision Cam: Partnership Request Declined",
                });
            }
            const updatedSell = await partner_model_1.default.findByIdAndUpdate(id, { status, description, affliate_id }, { new: true });
            res.status(200).json({
                success: true,
                message: "Update partner successfully",
                result: updatedSell,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async deletePartnerfirm(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const request = await partner_model_1.default.findById(id);
            if (!request)
                return res.status(404).json({ message: "Partner not found" });
            await partner_model_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Partner delete successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getCapture(req, res) {
        try {
            const allCaptures = await capture_models_1.default.find();
            res.status(200).json({
                success: true,
                message: "fetch successfully",
                result: allCaptures,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async addCapture(req, res) {
        try {
            const { type, value } = req.body;
            if (!type) {
                return res.status(400).json({ message: "Type is required" });
            }
            // Check if the type already exists
            const existingCapture = await capture_models_1.default.findOne({ type });
            if (existingCapture) {
                return res.status(400).json({ message: "Type must be unique" });
            }
            const newCapture = await capture_models_1.default.create({ type, value });
            res.status(200).json({
                success: true,
                message: "Added successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async updateCapture(req, res) {
        try {
            const { value, type } = req.body;
            // Check if the provided type is one of the allowed values
            const allowedTypes = ["Collisions", "Hit-and-runs", "Client-connection"];
            if (!allowedTypes.includes(type)) {
                return res.status(400).json({ error: "Invalid capture type" });
            }
            // Update only the 'value' field
            const updatedCapture = await capture_models_1.default.findOneAndUpdate({ type: type }, { value }, { new: true });
            if (!updatedCapture) {
                return res.status(404).json({ message: "Capture not found" });
            }
            res.status(200).json({
                success: true,
                message: "Updated successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map