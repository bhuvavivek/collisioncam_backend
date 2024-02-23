process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";

import "dotenv/config";
import App from "@/app";

//api routes
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import AjaxRoute from "@routes/ajax.route";
import AdminAuthRoute from "@routes/v1/admin/auth.routes";

//web routes

import validateEnv from "@utils/validateEnv";
import AdminFootageRoute from "./routes/v1/admin/footage.routes";
import UserRoute from "./routes/v1/user/user.routes";
import generalSettingsRoute from "./routes/v1/admin/generalSettings.routes";
import SubsriptionRoute from "./routes/v1/user/subscription/subscription.routes";
import paymentRoute from "./routes/v1/admin/payment.routes";
import GoogleRoute from "./routes/v1/google/google.routes";
validateEnv();

const app = new App([
  //api routes
  new AuthRoute(),
  new IndexRoute(),
  new AjaxRoute(),
  new AdminAuthRoute(),
  new AdminFootageRoute(),
  new UserRoute(),
  new generalSettingsRoute(),
  new SubsriptionRoute(),
  new paymentRoute(),
  new GoogleRoute(),
  //web routes
]);

app.listen();
