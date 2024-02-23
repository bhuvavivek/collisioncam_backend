"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const locale_en_json_1 = tslib_1.__importDefault(require("../../utils/locale.en.json"));
const express_validator_1 = require("express-validator");
const foogate_model_1 = tslib_1.__importDefault(require("../../models/foogate.model"));
const mongoose_1 = require("mongoose");
const cloudinary_1 = require("cloudinary");
const bucket_1 = require("../../bucket");
cloudinary_1.v2.config({
    cloud_name: "dcdwbdzql",
    api_key: "916793923444751",
    api_secret: "ue3Qjykqjooe7TBT8vyqd2OM1wI",
});
class AdminFootageController {
    // get profile
    async uploadFootage(req, res) {
        try {
            const { name, price, id, state, city, date, time, description } = req.body;
            if (!id)
                return res.status(400).json({ message: "Id is required" });
            if (!name)
                return res.status(400).json({ message: "Name is required" });
            if (!price)
                return res.status(400).json({ message: "Price is required" });
            console.log(req?.files);
            const photoFile = req?.files["photo"];
            const videoFile = req?.files["video"];
            console.log("photo", photoFile);
            console.log("Photo File Data Length:", photoFile.data.length);
            if (!photoFile) {
                return res.status(400).json({ message: "Thumbnail is required" });
            }
            if (!videoFile) {
                return res.status(400).json({ message: "Video is required" });
            }
            const footage = await foogate_model_1.default.findOne({ id });
            console.log(footage);
            if (footage)
                return res.status(400).json({ message: "Id already taken" });
            const options = {
                name,
                price,
                id,
                state: state !== "undefined" ? state : "",
                city: city !== "undefined" ? city : "",
                date: date !== "undefined" ? date : "",
                time: time !== "undefined" ? time : "",
                description: description !== "undefined" ? description : "",
            };
            if (photoFile) {
                const data = (await bucket_1.uploadAndPushFile("footage/images", photoFile, photoFile?.name, ""));
                options.thumbnail = data?.Location;
                options.thumbnailPublicKey = data?.Key;
            }
            if (videoFile) {
                const data = (await bucket_1.uploadAndPushFile("footage/videos", videoFile, videoFile?.name, ""));
                options.video = data?.Location;
                options.videoPublicKey = data?.Key;
            }
            const newFootage = new foogate_model_1.default(options);
            console.log(options);
            console.log("object", newFootage);
            await newFootage.save();
            res.status(200).json({
                success: true,
                response: newFootage,
                message: "Footage uploaded successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async editFootage(req, res) {
        try {
            const { id, name, price, state, city, date, time, thumbnailPublicKey, description, videoPublicKey, } = req.body;
            console.log(req.body?.name);
            const { footageId } = req.params;
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ message: errors.array()[0]?.msg });
            }
            let footage = await foogate_model_1.default.findById(footageId);
            if (!footage)
                return res.status(400).json({ message: "Footage not found" });
            const photoFile = req?.files?.photo;
            const videoFile = req?.files?.video;
            // const photoFile = req?.files["photo"];
            // const videoFile = req?.files["video"];
            if (footage?.id !== id) {
                const existingFootage = await foogate_model_1.default.findOne({ id });
                if (existingFootage)
                    return res.status(400).json({ message: "Id already taken" });
            }
            if (photoFile) {
                const photoData = (await bucket_1.uploadAndPushFile("footage/images", photoFile, photoFile.name, ""));
                await bucket_1.deleteFile("collisioncam-images/", String(thumbnailPublicKey));
                footage.thumbnail = photoData?.Location;
                footage.thumbnailPublicKey = photoData?.Key;
            }
            // Upload video if provided
            if (videoFile) {
                const videoData = (await bucket_1.uploadAndPushFile("footage/videos", videoFile, videoFile.name, ""));
                await bucket_1.deleteFile("collisioncam-images/", String(videoPublicKey));
                footage.video = videoData?.Location;
                footage.videoPublicKey = videoData?.Key;
            }
            if (id) {
                footage.id = id;
            }
            if (name) {
                footage.name = name;
            }
            if (price) {
                footage.price = price;
            }
            if (state) {
                footage.state = state;
            }
            if (city) {
                footage.city = city;
            }
            if (date) {
                footage.date = date;
            }
            if (time) {
                footage.time = time;
            }
            if (description) {
                footage.description = description;
            }
            await footage.save();
            res.status(200).json({
                success: true,
                response: footage,
                message: "Footage updated successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    // Register
    async getFootageAdmin(req, res) {
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
                .select("-video -videoPublicKey")
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
    async getSingleFootage(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ message: "ID is required" });
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const footage = await foogate_model_1.default
                .findById(id)
                .select("-video -videoPublicKey");
            if (!footage)
                return res.status(400).json({ message: "Footage is not avaiable" });
            res
                .status(200)
                .json({ success: true, message: locale_en_json_1.default.FETCH_SUCCESS, result: footage });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async getSingleFootagePrivate(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ message: "ID is required" });
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const footage = await foogate_model_1.default.findById(id);
            if (!footage)
                return res.status(400).json({ message: "Footage is not avaiable" });
            res
                .status(200)
                .json({ success: true, message: locale_en_json_1.default.FETCH_SUCCESS, result: footage });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
    async deleteFootage(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.isValidObjectId(id))
                return res.status(401).json({ message: "Invalid id" });
            const footage = await foogate_model_1.default.findById(id);
            if (!footage)
                return res.status(404).json({ message: "Footage not found" });
            await foogate_model_1.default.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Footage deleted successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
}
exports.default = AdminFootageController;
//# sourceMappingURL=footage.controller.js.map