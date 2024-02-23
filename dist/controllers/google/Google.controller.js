"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const locale_en_json_1 = tslib_1.__importDefault(require("../../utils/locale.en.json"));
const axios_1 = tslib_1.__importDefault(require("axios"));
class GoogleController {
    async getReviews(req, res) {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process?.env?.GOOGLE_MAP_ID}&key=${process.env.GOOGLE_MAP_API_KEY}`;
            const response = await axios_1.default.get(url);
            res.status(200).json({
                success: true,
                message: "Successfully",
                results: response?.data?.result,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: locale_en_json_1.default.SERVER_ERROR });
        }
    }
}
exports.default = GoogleController;
//# sourceMappingURL=Google.controller.js.map