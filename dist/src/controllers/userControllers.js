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
exports.loginWithSocial = exports.loginWithMobile = exports.loginWithEmail = exports.checkEmail = exports.verifyOtp = exports.resendOtp = exports.sendOtp = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const userModels_1 = __importDefault(require("../models/userModels"));
const OTP_1 = require("../utils/OTP");
dotenv.config();
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, userName: user.userName }, process.env.PRIVATE_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" });
};
if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY in environment variables.");
}
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
        let { userName, fullName, email, mobileNumber, dateOfBirth, password, confirmPassword, } = req.body;
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ message: "Passwords do not match", code: 400 });
        }
        const emailExists = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (emailExists) {
            return res
                .status(400)
                .json({ message: "Email already registered", code: 400 });
        }
        const usernameExists = await userModels_1.default.findOne({ userName: userName.trim() });
        if (usernameExists) {
            return res
                .status(400)
                .json({ message: "Username already taken", code: 400 });
        }
        if (!fullName || fullName.trim() === "") {
            fullName = userName;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const otp = (0, OTP_1.generateOTP)();
        const otpExpires = (0, moment_1.default)().add(5, "minutes").toDate();
        const user = await userModels_1.default.create({
            userName: userName.trim(),
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            mobileNumber: mobileNumber?.trim(),
            dateOfBirth,
            password: hashedPassword,
            OTP: otp,
            otpExpires,
            isEmailVerified: false,
        });
        await (0, OTP_1.sendOTP)(email, otp);
        if (mobileNumber && mobileNumber.trim() !== "") {
            await (0, OTP_1.sendOTP)(mobileNumber, otp);
        }
        return res.status(201).json({
            message: "User registered. OTP sent.",
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
        if (!email)
            return res.status(400).json({ message: "Email is required", code: 400 });
        const user = await userModels_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found", code: 404 });
        await generateAndSendOTP(user);
        return res
            .status(200)
            .json({ message: "OTP sent successfully", code: 200 });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
exports.resendOtp = exports.sendOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const { email, OTP } = req.body;
        if (!email || !OTP)
            return res
                .status(400)
                .json({ message: "Email and OTP required", code: 400 });
        const user = await userModels_1.default.findOne({ email });
        if (!user || user.OTP !== OTP) {
            return res.status(400).json({ message: "Invalid OTP", code: 400 });
        }
        if (!user.otpExpires || (0, moment_1.default)().isAfter(user.otpExpires)) {
            return res.status(400).json({ message: "OTP expired", code: 400 });
        }
        user.isEmailVerified = true;
        await user.save();
        console.log("After verification:", user.isEmailVerified);
        return res
            .status(200)
            .json({ message: "OTP verified successfully", code: 200 });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            return res.status(200).json({
                exists: true,
                message: "Email already exists",
                code: 200,
                user,
            });
        }
        else {
            return res.status(404).json({
                exists: false,
                message: "Email not found, please sign up",
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
        const { email, password, loginType } = req.body;
        if (loginType !== "0") {
            return res.status(400).json({ message: "Invalid login type", code: 400 });
        }
        const user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
        if (!user)
            return res.status(404).json({ message: "User not found", code: 404 });
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid credentials", code: 401 });
        }
        const token = generateToken(user);
        if (!user.isEmailVerified) {
            return res
                .status(403)
                .json({
                message: "Email not verified",
                code: 403,
                isEmailVerified: false,
            });
        }
        return res.status(200).json({
            message: "Login successful",
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
        const { mobileNumber, loginType } = req.body;
        if (loginType !== "1") {
            return res.status(400).json({ message: "Invalid login type", code: 400 });
        }
        const user = await userModels_1.default.findOne({ mobileNumber: mobileNumber.trim() });
        if (!user)
            return res.status(404).json({ message: "User not found", code: 404 });
        const otp = (0, OTP_1.generateOTP)();
        user.OTP = otp;
        user.otpExpires = (0, moment_1.default)().add(5, "minutes").toDate();
        await user.save();
        await (0, OTP_1.sendOTP)(user.mobileNumber, otp);
        return res.status(200).json({
            message: "OTP sent to registered mobile number",
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
        const { email, loginType, socialId } = req.body;
        if (!email || !socialId || !loginType) {
            return res.status(400).json({ message: "email, socialId, and loginType are required", code: 400 });
        }
        let user = await userModels_1.default.findOne({
            socialIds: {
                $elemMatch: {
                    id: socialId,
                    type: loginType,
                    email: email.toLowerCase().trim(),
                },
            },
        });
        if (!user) {
            user = await userModels_1.default.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                return res.status(404).json({
                    message: "User not found. Please sign up.",
                    code: 404,
                });
            }
            const alreadyLinked = user.socialIds?.some((s) => s.id === socialId && s.type === loginType);
            if (!alreadyLinked) {
                user.socialIds = user.socialIds || [];
                user.socialIds.push({
                    id: socialId,
                    type: loginType,
                    email: email.toLowerCase().trim(),
                });
                await user.save();
            }
        }
        const token = generateToken(user);
        return res.status(200).json({
            message: "Social login successful",
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