"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const inputValidation_1 = require("../../../middlewares/inputValidation");
const generalSettings_controller_1 = tslib_1.__importDefault(require("../../../controllers/admin/generalSettings.controller"));
class generalSettingsRoute {
    path = "/api/v1/general-settings";
    router = express_1.Router();
    generalSettings = new generalSettings_controller_1.default();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/", this.generalSettings.getGeneralSettings);
        this.router.put(this.path + "/notification/:id", inputValidation_1.notificationSettingsInput, this.generalSettings.notificationSettings);
        this.router.put(this.path + "/request/:id", inputValidation_1.requestSettingsInput, this.generalSettings.requestSettings);
    }
}
exports.default = generalSettingsRoute;
//# sourceMappingURL=generalSettings.routes.js.map