"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    name;
    role;
    email;
    mobile;
    password;
    gender;
    dob;
    profileImage;
    bgImage;
    address;
    location;
    categories;
    description;
    speciality;
    hourlyRate;
    experienceYear;
    documents;
    goals;
    height;
    weight;
    device;
    social;
    otpId;
    resetToken;
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
tslib_1.__decorate([
    class_validator_1.IsEmail(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "mobile", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "gender", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "dob", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "profileImage", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "bgImage", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsObject(),
    tslib_1.__metadata("design:type", Object)
], CreateUserDto.prototype, "location", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    class_validator_1.IsMongoId({
        each: true,
    }),
    tslib_1.__metadata("design:type", Array)
], CreateUserDto.prototype, "categories", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", Object)
], CreateUserDto.prototype, "description", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    tslib_1.__metadata("design:type", Array)
], CreateUserDto.prototype, "speciality", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Number)
], CreateUserDto.prototype, "hourlyRate", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Number)
], CreateUserDto.prototype, "experienceYear", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsObject(),
    tslib_1.__metadata("design:type", Object)
], CreateUserDto.prototype, "documents", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    class_validator_1.IsMongoId({
        each: true,
    }),
    tslib_1.__metadata("design:type", Array)
], CreateUserDto.prototype, "goals", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "height", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Number)
], CreateUserDto.prototype, "weight", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsObject(),
    tslib_1.__metadata("design:type", Object)
], CreateUserDto.prototype, "device", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsObject(),
    tslib_1.__metadata("design:type", Object)
], CreateUserDto.prototype, "social", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "otpId", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "resetToken", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=users.dto.js.map