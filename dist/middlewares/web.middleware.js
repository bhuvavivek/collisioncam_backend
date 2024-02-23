"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const HttpException_1 = tslib_1.__importDefault(require("../exceptions/HttpException"));
const webValidation = (type, value = 'body', skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true) => {
    return (req, res, next) => {
        class_validator_1.validate(class_transformer_1.plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors) => {
            if (errors.length > 0) {
                const message = errors.map((error) => Object.values(error.constraints)).join(', ');
                req.flash("error", message);
                next(new HttpException_1.default(400, message));
            }
            else {
                next();
            }
        });
    };
};
exports.default = webValidation;
//# sourceMappingURL=web.middleware.js.map