"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOtpDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateOtpDto {
    mobile;
    otp;
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateOtpDto.prototype, "mobile", void 0);
tslib_1.__decorate([
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Number)
], CreateOtpDto.prototype, "otp", void 0);
exports.CreateOtpDto = CreateOtpDto;
//# sourceMappingURL=otps.dto.js.map