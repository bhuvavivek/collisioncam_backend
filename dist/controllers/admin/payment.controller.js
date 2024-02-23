"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const locale_en_json_1 = tslib_1.__importDefault(require("../../utils/locale.en.json"));
const payment_model_1 = tslib_1.__importDefault(require("../../models/payment.model"));
const mongoose_1 = require("mongoose");
class PaymentController {
    async getPayment(req, res) {
        try {
            const { page = 1, limit = 10, name, startDate, endDate, type, sort, } = req.query;
            const query = {};
            if (name)
                query.name = { $regex: new RegExp(String(name), "i") };
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate)
                    query.createdAt.$gte = new Date(String(startDate));
                if (endDate)
                    query.createdAt.$lte = new Date(String(endDate));
            }
            if (type)
                query.type = type;
            const payments = await payment_model_1.default
                .find(query)
                .sort({ createdAt: sort === "asc" ? 1 : -1 })
                .limit(parseInt(limit, 10))
                .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
                .exec();
            const total = await payment_model_1.default.countDocuments(query).exec();
            res.json({
                result: payments,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSinglePayment(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const payment = await payment_model_1.default.findById(id);
            if (!payment)
                return res.status(404).json({ message: "Payment not found" });
            res.status(200).json({
                success: true,
                message: "Fetch single payment successfully",
                result: payment,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async deletePayment(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const payment = await payment_model_1.default.findById(id);
            if (!payment)
                return res.status(404).json({ message: "Payment not found" });
            await payment_model_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Deleted successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
}
exports.default = PaymentController;
//# sourceMappingURL=payment.controller.js.map