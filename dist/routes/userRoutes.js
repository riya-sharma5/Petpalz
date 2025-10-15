"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userValidation_1 = require("../middlewares/userValidation");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
router.post("/signup", (0, userValidation_1.validateRequest)(userValidation_1.signupValidation), userControllers_1.signup);
router.post("/login", (0, userValidation_1.validateRequest)(userValidation_1.loginValidation), userControllers_1.login);
router.post('/otp', (0, userValidation_1.validateRequest)(userValidation_1.sendOtpValidation), userControllers_1.sendOtp);
router.post('/verify', (0, userValidation_1.validateRequest)(userValidation_1.verifyOtpValidation), userControllers_1.verifyOtp);
router.post('/resend', (0, userValidation_1.validateRequest)(userValidation_1.resendOtpValidation), userControllers_1.resendOtp);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map