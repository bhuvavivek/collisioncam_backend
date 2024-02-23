"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";
const config_1 = tslib_1.__importDefault(require("config"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const express_fileupload_1 = tslib_1.__importDefault(require("express-fileupload"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const hpp_1 = tslib_1.__importDefault(require("hpp"));
const path_1 = tslib_1.__importDefault(require("path"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const mongoose_1 = require("mongoose");
const _databases_1 = require("./databases");
const error_middleware_1 = tslib_1.__importDefault(require("./middlewares/error.middleware"));
const logger_1 = require("./utils/logger");
const cookie_session_1 = tslib_1.__importDefault(require("cookie-session"));
const express_flash_1 = tslib_1.__importDefault(require("express-flash"));
class App {
    app;
    port;
    env;
    constructor(routes) {
        this.app = express_1.default();
        this.port = process.env.PORT || 5000;
        this.env = process.env.NODE_ENV || "development";
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(this.port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${this.env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        if (this.env !== "production") {
            mongoose_1.set("debug", true);
        }
        mongoose_1.connect(_databases_1.dbConnection.url, _databases_1.dbConnection.options).catch((error) => logger_1.logger.info(`${error}`));
    }
    initializeMiddlewares() {
        if (this.env === "production") {
            this.app.use(morgan_1.default("combined", { stream: logger_1.stream }));
            this.app.use(cors_1.default({
                origin: [
                    "https://collisioncam.org",
                    "https://admin.collisioncam.org",
                    "https://password.collisioncam.org",
                    "http://localhost:5173",
                    "http://localhost:3030",
                    "http://localhost:3033"
                ],
                credentials: true,
            }));
        }
        else {
            this.app.use(morgan_1.default("dev", { stream: logger_1.stream }));
            this.app.use(cors_1.default({ origin: true, credentials: true }));
        }
        this.app.use(hpp_1.default());
        this.app.use(helmet_1.default({
            contentSecurityPolicy: false,
        }));
        this.app.use(compression_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_parser_1.default());
        this.app.use(express_fileupload_1.default({
            useTempFiles: true,
        }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        this.app.use(cookie_session_1.default({
            secret: config_1.default.get("secretKey"),
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
            },
        }));
        this.app.use(express_flash_1.default());
        // view engine setup
        this.app.set("views", path_1.default.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map