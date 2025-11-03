"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userValidation_1 = require("../validations/userValidation");
const userControllers_1 = require("../controllers/userControllers");
//import { verifyJWT } from "../middlewares/JwtVerify";
const router = (0, express_1.Router)();
router.post("/signup", (0, userValidation_1.validateRequest)(userValidation_1.signupValidation), userControllers_1.signup);
router.post("/email-login", (0, userValidation_1.validateRequest)(userValidation_1.loginWithEmailValidation), userControllers_1.loginWithEmail);
router.post("/mobile-login", userControllers_1.loginWithMobile);
router.post("/social-login", userControllers_1.loginWithSocial);
router.get("/list", (0, userValidation_1.validateParams)(userValidation_1.listValidation), userControllers_1.listUsers);
router.post('/send-otp', (0, userValidation_1.validateRequest)(userValidation_1.sendOtpValidation), userControllers_1.sendOtp);
router.post('/verify-otp', (0, userValidation_1.validateRequest)(userValidation_1.verifyOtpValidation), userControllers_1.verifyOtp);
router.post('/check-email', userControllers_1.checkEmail);
//router.post('/resend-otp', validateRequest(resendOtpValidation), resendOtp);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map