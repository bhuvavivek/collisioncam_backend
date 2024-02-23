"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";
require("dotenv/config");
const app_1 = tslib_1.__importDefault(require("./app"));
//api routes
const auth_route_1 = tslib_1.__importDefault(require("./routes/auth.route"));
const index_route_1 = tslib_1.__importDefault(require("./routes/index.route"));
const ajax_route_1 = tslib_1.__importDefault(require("./routes/ajax.route"));
const auth_routes_1 = tslib_1.__importDefault(require("./routes/v1/admin/auth.routes"));
//web routes
const validateEnv_1 = tslib_1.__importDefault(require("./utils/validateEnv"));
const footage_routes_1 = tslib_1.__importDefault(require("./routes/v1/admin/footage.routes"));
const user_routes_1 = tslib_1.__importDefault(require("./routes/v1/user/user.routes"));
const generalSettings_routes_1 = tslib_1.__importDefault(require("./routes/v1/admin/generalSettings.routes"));
const subscription_routes_1 = tslib_1.__importDefault(require("./routes/v1/user/subscription/subscription.routes"));
const payment_routes_1 = tslib_1.__importDefault(require("./routes/v1/admin/payment.routes"));
const google_routes_1 = tslib_1.__importDefault(require("./routes/v1/google/google.routes"));
validateEnv_1.default();
const app = new app_1.default([
    //api routes
    new auth_route_1.default(),
    new index_route_1.default(),
    new ajax_route_1.default(),
    new auth_routes_1.default(),
    new footage_routes_1.default(),
    new user_routes_1.default(),
    new generalSettings_routes_1.default(),
    new subscription_routes_1.default(),
    new payment_routes_1.default(),
    new google_routes_1.default(),
    //web routes
]);
app.listen();
//# sourceMappingURL=server.js.map