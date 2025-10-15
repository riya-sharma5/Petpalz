import { Router } from "express";
import { validateRequest, signupValidation, sendOtpValidation, resendOtpValidation, verifyOtpValidation, loginValidation } from "../middlewares/userValidation";

import {
 signup,
 sendOtp,
 resendOtp,
 verifyOtp,
 checkEmail,
 loginWithEmail,
 loginWithMobile,
 loginWithSocial
} from "../controllers/userControllers";
import { verifyJWT } from "../middlewares/JwtVerify";


const router = Router();

router.post("/signup", validateRequest(signupValidation), signup);
router.post("/email-login", validateRequest(loginValidation), loginWithEmail);
router.post("/mobile-login", loginWithMobile);
router.post("/social-login", loginWithSocial);
router.post('/otp', validateRequest(sendOtpValidation), sendOtp);
router.post('/verify', validateRequest(verifyOtpValidation), verifyOtp);
router.post('/check-email', checkEmail);
router.post('/resend', validateRequest(resendOtpValidation), resendOtp);

export default router;
