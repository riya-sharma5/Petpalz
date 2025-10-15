import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import moment from "moment";
import userModel from "../models/userModels";
import { generateOTP, sendOTP } from "../utils/OTP";


const generateToken = (user: any) => {
  return jwt.sign(
    { _id: user._id, email: user.email, userName: user.userName },
    process.env.PRIVATE_KEY as string,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as string)  as '1d'|| "1d" }
  );
};

dotenv.config();

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
  const otpExpires = moment().add(5, "minutes").toDate();
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
    const {
      userName,
      fullName,
      email,
      mobileNumber,
      DOB,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", code: 400 });
    }

    const emailExists = await userModel.findOne({ email });
    console.log("emailexist", emailExists);
    if (emailExists)
      return res
        .status(400)
        .json({ message: "Email already registered", code: 400 });

    const usernameExists = await userModel.findOne({ userName });
    if (usernameExists)
      return res
        .status(400)
        .json({ message: "Username already taken", code: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = moment().add(5, "minutes").toDate();

    const user = await userModel.create({
      userName,
      fullName,
      email,
      mobileNumber,
      DOB,
      password: hashedPassword,
      OTP: otp,
      otpExpires,
      isEmailVerified: false,
    });

    await sendOTP(email, otp);

    return res.status(201).json({
      message: "User registered. OTP sent.",
      code: 201,
      data: user,
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
      return res.status(400).json({ message: "Email is required", code: 400 });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found", code: 404 });

    await generateAndSendOTP(user);

    return res
      .status(200)
      .json({ message: "OTP sent successfully", code: 200 });
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
        .json({ message: "Email and OTP required", code: 400 });

    const user = await userModel.findOne({ email });
    if (!user || user.OTP !== OTP) {
      return res.status(400).json({ message: "Invalid OTP", code: 400 });
    }

    if (!user.otpExpires || moment().isAfter(user.otpExpires)) {
      return res.status(400).json({ message: "OTP expired", code: 400 });
    }

    //user.OTP = null;
   // user.otpExpires = null;
    user.isEmailVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "OTP verified successfully", code: 200 });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier, password } = req.body;

  const query = identifier.includes("@")
      ? { email: identifier.toLowerCase().trim() }
      : { mobileNumber: identifier.trim() };

    const user = await userModel.findOne(query);
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register.",
        code: 404,
        redirectTo: "signup",
      });
    }

    if (!user.isEmailVerified) {
      //await generateAndSendOTP(user);
      return res.status(200).json({
      message: "logged in",
      code: 200,
      data: user,
      isEmailVerified: false
      //requireOTP: true,
      //email: user.email,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", code: 401 });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, userName: user.userName },
      process.env.PRIVATE_KEY as string,
      { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as "1d") || "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      code: 200,
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};



