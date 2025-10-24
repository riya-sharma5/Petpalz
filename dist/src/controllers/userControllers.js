"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithSocial = exports.loginWithMobile = exports.loginWithEmail = exports.checkEmail = exports.verifyOtp = exports.sendOtp = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const userModels_1 = __importDefault(require("../models/userModels"));
const enum_1 = require("../utils/enum");
const OTP_1 = require("../utils/OTP");
const message_1 = require("../utils/message");
dotenv.config();
if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY in environment variables.");
}
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, userName: user.userName }, process.env.PRIVATE_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" });
};
const sanitizeUser = (user) => {
    const obj = user.toObject();
    delete obj.password;
    delete obj.OTP;
    delete obj.otpExpires;
    return obj;
};
const generateAndSendOTP = async (user) => {
    const otp = (0, OTP_1.generateOTP)();
    const otpExpires = (0, moment_1.default)().add(2, "minutes").toDate();
    user.OTP = otp;
    user.otpExpires = otpExpires;
    await user.save();
    await (0, OTP_1.sendOTP)(user.email, otp);
};
const signup = async (req, res, next) => {
    try {
        let { userName, fullName, email, mobileNumber, dateOfBirth, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.passwordNotMatched,
                code: 400,
            });
        }
        const emailExists = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (emailExists) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.emailAlreadyExists,
                code: 400,
            });
        }
        const usernameExists = await userModels_1.default.findOne({ userName: userName.trim() });
        if (usernameExists) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.usernameAlreadyExists,
                code: 400,
            });
        }
        if (!fullName || fullName.trim() === "") {
            fullName = userName;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await userModels_1.default.create({
            userName: userName.trim(),
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            mobileNumber: mobileNumber?.trim(),
            dateOfBirth,
            password: hashedPassword,
            isEmailVerified: false,
        });
        return res.status(201).json({
            message: message_1.SUCCESS_RESPONSE.userRegistered,
            code: 201,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.userNotFound,
                code: 404,
            });
        }
        await generateAndSendOTP(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.otpSent,
            code: 200,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const { email, OTP } = req.body;
        const user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user || user.OTP !== OTP) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.invalidOtp,
                code: 400,
            });
        }
        if (!user.otpExpires || (0, moment_1.default)().isAfter(user.otpExpires)) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.otpExpired,
                code: 400,
            });
        }
        user.isEmailVerified = true;
        await user.save();
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.otpVerified,
            code: 200,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModels_1.default.findOne({ email: email });
        if (user) {
            return res.status(200).json({
                exists: true,
                message: message_1.ERROR_RESPONSE.emailAlreadyExists,
                code: 200,
                user,
            });
        }
        else {
            return res.status(404).json({
                exists: false,
                message: message_1.ERROR_RESPONSE.emailSignup,
                code: 404,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.checkEmail = checkEmail;
const loginWithEmail = async (req, res, next) => {
    try {
        const { email, password, loginType: type } = req.body;
        if (type !== enum_1.loginType.email) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.invalidLogin,
                code: 400,
            });
        }
        const user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.userNotFound,
                code: 404,
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: message_1.ERROR_RESPONSE.invalidCredentials,
                code: 401,
            });
        }
        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: message_1.ERROR_RESPONSE.emailNotVerified,
                code: 403,
                isEmailVerified: false,
            });
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.loginSuccessful,
            code: 200,
            token,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginWithEmail = loginWithEmail;
const loginWithMobile = async (req, res, next) => {
    try {
        const { mobileNumber, loginType: type } = req.body;
        if (type !== enum_1.loginType["mobile-number"]) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.invalidLogin,
                code: 400,
            });
        }
        const user = await userModels_1.default.findOne({ mobileNumber: mobileNumber.trim() });
        if (!user) {
            return res.status(404).json({
                message: message_1.ERROR_RESPONSE.userNotFound,
                code: 404,
            });
        }
        const otp = (0, OTP_1.generateOTP)();
        user.OTP = otp;
        user.otpExpires = (0, moment_1.default)().add(5, "minutes").toDate();
        await user.save();
        // await sendOTP(user.mobileNumber, otp);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.mobileOtpSent,
            code: 200,
            userId: user._id,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginWithMobile = loginWithMobile;
const loginWithSocial = async (req, res, next) => {
    try {
        const { email, loginType: type, socialId } = req.body;
        if (!Object.values(enum_1.loginType).includes(type)) {
            return res.status(400).json({
                message: message_1.ERROR_RESPONSE.invalidLogin,
                code: 400,
            });
        }
        let user = await userModels_1.default.findOne({
            socialIds: {
                $elemMatch: {
                    id: socialId,
                    type,
                    email,
                },
            },
        });
        if (!user) {
            user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                return res.status(404).json({
                    message: message_1.ERROR_RESPONSE.userSignup,
                    code: 404,
                });
            }
            const alreadyLinked = user.socialIds?.some(s => s.id === socialId && s.type === type);
            if (!alreadyLinked) {
                user.socialIds = user.socialIds || [];
                user.socialIds.push({ id: socialId, type, email });
                await user.save();
            }
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.socialLogin,
            code: 200,
            token,
            data: sanitizeUser(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginWithSocial = loginWithSocial;
//# sourceMappingURL=userControllers.js.map