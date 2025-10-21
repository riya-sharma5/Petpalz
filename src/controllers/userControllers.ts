import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import moment from "moment";
import userModel, { loginType } from "../models/userModels";
import { generateOTP, sendOTP } from "../utils/OTP";
import { messages } from "../utils/message";

dotenv.config();

const generateToken = (user: any) => {
  return jwt.sign(
    { _id: user._id, email: user.email, userName: user.userName },
    process.env.PRIVATE_KEY as string,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as string as "1d") || "1d" }
  );
};

if (!process.env.PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY in environment variables.");
}

const sanitizeUser = (user: any) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.OTP;
  delete obj.otpExpires;
  return obj;
};

const generateAndSendOTP = async (user: any) => {
  const otp = generateOTP();
  const otpExpires = moment().add(2, "minutes").toDate();
  user.OTP = otp;
  user.otpExpires = otpExpires;
  await user.save();
  await sendOTP(user.email, otp);
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      userName,
      fullName,
      email,
      mobileNumber,
      dateOfBirth,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: messages.passwordNotMatched, code: 400 });
    }

    const emailExists = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: messages.emailAlreadyExists, code: 400 });
    }

    const usernameExists = await userModel.findOne({
      userName: userName.trim(),
    });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: messages.usernameAlreadyExists, code: 400 });
    }

    if (!fullName || fullName.trim() === "") {
      fullName = userName;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName: userName.trim(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: mobileNumber?.trim(),
      dateOfBirth,
      password: hashedPassword,
      isEmailVerified: false,
    });

    return res.status(201).json({
      message: messages.userRegistered,
      code: 201,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: messages.emailRequired, code: 400 });

    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: messages.userNotFound, code: 404 });

    await generateAndSendOTP(user);

    return res.status(200).json({ message: messages.otpSent, code: 200 });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = sendOtp;

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, OTP } = req.body;
    if (!email || !OTP)
      return res
        .status(400)
        .json({ message: messages.emailOtpRequired, code: 400 });

    const user = await userModel.findOne({ email });
    if (!user || user.OTP !== OTP) {
      return res.status(400).json({ message: messages.invalidOtp, code: 400 });
    }

    if (!user.otpExpires || moment().isAfter(user.otpExpires)) {
      return res.status(400).json({ message: messages.otpExpired, code: 400 });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({ message: messages.otpVerified, code: 200 });
  } catch (error) {
    next(error);
  }
};

export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      return res.status(200).json({
        exists: true,
        message: messages.emailAlreadyExists,
        code: 200,
        user,
      });
    } else {
      return res.status(404).json({
        exists: false,
        message: messages.emailSignup,
        code: 404,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const loginWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, loginType } = req.body;

    if (loginType !== "0") {
      return res
        .status(400)
        .json({ message: messages.invalidLogin, code: 400 });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res
        .status(404)
        .json({ message: messages.userNotFound, code: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: messages.invalidCredentials, code: 401 });
    }

    const token = generateToken(user);
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: messages.emailNotVerified,
        code: 403,
        isEmailVerified: false,
      });
    }

    return res.status(200).json({
      message: messages.loginSuccessful,
      code: 200,
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithMobile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const { mobileNumber, loginType } = req.body;
    console.log("number", loginType, "number", mobileNumber);

    if (loginType !== "1") {
      return res
        .status(400)
        .json({ message: messages.invalidLogin, code: 400 });
    }

    const user = await userModel.findOne({ mobileNumber: mobileNumber.trim() });
    if (!user)
      return res
        .status(404)
        .json({ message: messages.userNotFound, code: 404 });

    const otp = generateOTP();
    user.OTP = otp;
    user.otpExpires = moment().add(5, "minutes").toDate();
    await user.save();

    //await sendOTP(user.mobileNumber, otp);

    return res.status(200).json({
      message: messages.mobileOtpSent,
      code: 200,
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithSocial = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, loginType, socialId } = req.body;

    let user = await userModel.findOne({
      socialIds: {
        $elemMatch: {
          id: socialId,
          type: loginType,
          email: email,
        },
      },
    });

    if (!user) {
      user = await userModel.findOne({ email: email});

      if (!user) {
        return res.status(404).json({
          message: messages.userSignup,
          code: 404,
        });
      }

      const alreadyLinked = user.socialIds?.some(
        (s: any) => s.id === socialId && s.type === loginType
      );

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
      message: messages.socialLogin,
      code: 200,
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};
