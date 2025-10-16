import { Router } from "express";
import { validateRequest, signupValidation, sendOtpValidation, resendOtpValidation, verifyOtpValidation, loginWithEmailValidation } from "../middlewares/userValidation";

import {
 signup,
 sendOtp,
 resendOtp,
 verifyOtp,
 checkEmail,
 loginWithEmail,
 loginWithMobile,
 loginWithSocial,

} from "../controllers/userControllers";
//import { verifyJWT } from "../middlewares/JwtVerify";


const router = Router();

router.post("/signup", validateRequest(signupValidation), signup);
router.post("/email-login", validateRequest(loginWithEmailValidation), loginWithEmail);
router.post("/mobile-login", loginWithMobile);
router.post("/social-login", loginWithSocial);

router.post('/send-otp', validateRequest(sendOtpValidation), sendOtp);
router.post('/verify-otp', validateRequest(verifyOtpValidation), verifyOtp);
router.post('/check-email', checkEmail);
router.post('/resend-otp', validateRequest(resendOtpValidation), resendOtp);

export default router;
