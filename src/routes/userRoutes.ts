import { Router } from "express";
import { validateRequest, signupValidation, sendOtpValidation, resendOtpValidation, verifyOtpValidation, loginValidation } from "../middlewares/userValidation";

import {
 signup,
 sendOtp,
 resendOtp,
 verifyOtp,
 login
} from "../controllers/userControllers";
import { verifyJWT } from "../middlewares/JwtVerify";


const router = Router();

router.post("/signup", validateRequest(signupValidation), signup);
router.post("/login", validateRequest(loginValidation), login);
router.post('/otp', validateRequest(sendOtpValidation), sendOtp);
router.post('/verify', validateRequest(verifyOtpValidation), verifyOtp);
router.post('/resend', validateRequest(resendOtpValidation), resendOtp);

export default router;
