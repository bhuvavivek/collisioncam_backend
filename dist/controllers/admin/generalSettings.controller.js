"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const locale_en_json_1 = tslib_1.__importDefault(require("../../utils/locale.en.json"));
const express_validator_1 = require("express-validator");
const foogate_model_1 = tslib_1.__importDefault(require("../../models/foogate.model"));
const generalSettings_model_1 = tslib_1.__importDefault(require("../../models/generalSettings.model"));
class generalSettingsController {
    async getGeneralSettings(req, res) {
        try {
            const settings = await generalSettings_model_1.default.find();
            res.status(200).json({ success: true, settings: settings[0] });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Register
    async getFootage(req, res) {
        try {
            const { state, city, fromDate, toDate, name, page, limit, sortBy } = req.query;
            let query = {};
            if (state) {
                query.state = state;
            }
            if (city) {
                query.city = city;
            }
            if (fromDate && toDate) {
                query.date = { $gte: fromDate, $lte: toDate };
            }
            if (name) {
                query.name = { $regex: name, $options: "i" };
            }
            const sortOptions = {};
            if (sortBy === "new") {
                sortOptions["createdAt"] = -1;
            }
            else if (sortBy === "old") {
                sortOptions["createdAt"] = 1;
            }
            if (sortBy === "asc") {
                sortOptions["name"] = 1;
            }
            else if (sortBy === "desc") {
                sortOptions["name"] = -1;
            }
            const currentPage = parseInt(page) || 1;
            const documentsLimit = parseInt(limit) || 10;
            const startIndex = (currentPage - 1) * documentsLimit;
            const totalCount = await foogate_model_1.default.countDocuments(query);
            const results = await foogate_model_1.default
                .find(query)
                .sort(sortOptions)
                .limit(documentsLimit)
                .skip(startIndex);
            res.status(200).json({ success: true, result: results, totalCount });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async notificationSettings(req, res) {
        try {
            const { sellClaimRequest, affiliateRequest, freeFootageRequest } = req.body;
            const { id } = req.params;
            console.log(id);
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const filter = { _id: id };
            const update = {
                sellClaimRequest,
                affiliateRequest,
                freeFootageRequest,
            };
            console.log(update);
            const updatedDocument = await generalSettings_model_1.default.findOneAndUpdate(filter, update, {
                new: true,
            });
            if (!updatedDocument) {
                return res
                    .status(404)
                    .json({ success: false, message: "Document not found" });
            }
            res.status(200).json({
                success: true,
                message: "Update successful",
                data: updatedDocument,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
    async requestSettings(req, res) {
        try {
            const { commisionRate, affiliateTermsCondition, sellClaimTermsCondition, } = req.body;
            const { id } = req.params;
            console.log(id);
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            const filter = { _id: id };
            const update = {
                commisionRate,
                affiliateTermsCondition,
                sellClaimTermsCondition,
            };
            console.log(update);
            const updatedDocument = await generalSettings_model_1.default.findOneAndUpdate(filter, update, {
                new: true,
            });
            if (!updatedDocument) {
                return res
                    .status(404)
                    .json({ success: false, message: "Document not found" });
            }
            res.status(200).json({
                success: true,
                message: "Update successful",
                data: updatedDocument,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}
exports.default = generalSettingsController;
//# sourceMappingURL=generalSettings.controller.js.map