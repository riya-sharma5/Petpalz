"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithSocialValidation = exports.loginWihMobileValidation = exports.loginWithEmailValidation = exports.verifyOtpValidation = exports.checkEmailValidation = exports.resendOtpValidation = exports.sendOtpValidation = exports.signupValidation = exports.validateParams = exports.validateQuery = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.body);
            req.body = result;
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: error.details[0]?.message,
            });
        }
    };
};
exports.validateRequest = validateRequest;
const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.query);
            req.query = result;
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: error?.details ? error?.details[0]?.message : "something went wrong",
            });
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.params);
            req.params = result;
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: error?.details ? error?.details[0]?.message : "something went wrong",
            });
        }
    };
};
exports.validateParams = validateParams;
exports.signupValidation = joi_1.default.object({
    userName: joi_1.default.string().required(),
    fullName: joi_1.default.string().optional(),
    email: joi_1.default.string().required(),
    mobileNumber: joi_1.default.string().optional(),
    dateOfBirth: joi_1.default.string().optional(),
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.string().required()
});
exports.sendOtpValidation = joi_1.default.object({
    email: joi_1.default.string().required()
});
exports.resendOtpValidation = joi_1.default.object({
    email: joi_1.default.string().required()
});
exports.checkEmailValidation = joi_1.default.object({
    email: joi_1.default.string().required()
});
exports.verifyOtpValidation = joi_1.default.object({
    email: joi_1.default.string().required(),
    OTP: joi_1.default.string().required()
});
exports.loginWithEmailValidation = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    loginType: joi_1.default.string().required()
});
exports.loginWihMobileValidation = joi_1.default.object({
    mobileNumber: joi_1.default.string().required(),
    loginType: joi_1.default.string().required()
});
exports.loginWithSocialValidation = joi_1.default.object({
    loginType: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    socialId: joi_1.default.string().required()
});
//# sourceMappingURL=userValidation.js.map