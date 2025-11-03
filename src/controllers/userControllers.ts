import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import moment from "moment";
import userModel from "../models/userModels";
import { loginType } from "../utils/enum";
import { generateOTP, sendOTP } from "../utils/OTP";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import chatModel from "../models/chatModel";
import mongoose from "mongoose";
//import webSocket from "../middlewares/webSocket"

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY in environment variables.");
}

const generateToken = (user: any) => {
  return jwt.sign(
    { _id: user._id, email: user.email, userName: user.userName },
    process.env.PRIVATE_KEY as string,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as "1d") || "1d" }
  );
};

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
      return res.status(400).json({
        message: ERROR_RESPONSE.passwordNotMatched,
        code: 400,
      });
    }

    const emailExists = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (emailExists) {
      return res.status(400).json({
        message: ERROR_RESPONSE.emailAlreadyExists,
        code: 400,
      });
    }

    const usernameExists = await userModel.findOne({
      userName: userName.trim(),
    });
    if (usernameExists) {
      return res.status(400).json({
        message: ERROR_RESPONSE.usernameAlreadyExists,
        code: 400,
      });
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
      message: SUCCESS_RESPONSE.userRegistered,
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

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        message: ERROR_RESPONSE.userNotFound,
        code: 404,
      });
    }

    await generateAndSendOTP(user);

    return res.status(200).json({
      message: SUCCESS_RESPONSE.otpSent,
      code: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, OTP } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.OTP !== OTP) {
      return res.status(400).json({
        message: ERROR_RESPONSE.invalidOtp,
        code: 400,
      });
    }

    if (!user.otpExpires || moment().isAfter(user.otpExpires)) {
      return res.status(400).json({
        message: ERROR_RESPONSE.otpExpired,
        code: 400,
      });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      message: SUCCESS_RESPONSE.otpVerified,
      code: 200,
    });
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
    const user = await userModel.findOne({ email: email });

    if (user) {
      return res.status(200).json({
        exists: true,
        message: ERROR_RESPONSE.emailAlreadyExists,
        code: 200,
        user,
      });
    } else {
      return res.status(404).json({
        exists: false,
        message: ERROR_RESPONSE.emailSignup,
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
    const { email, password, loginType: type } = req.body;

    console.log("hitted");
    if (type !== loginType.email) {
      return res.status(400).json({
        message: ERROR_RESPONSE.invalidLogin,
        code: 400,
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        message: ERROR_RESPONSE.userNotFound,
        code: 404,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: ERROR_RESPONSE.invalidCredentials,
        code: 401,
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: ERROR_RESPONSE.emailNotVerified,
        code: 403,
        isEmailVerified: false,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: SUCCESS_RESPONSE.loginSuccessful,
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
    const { mobileNumber, loginType: type } = req.body;
    console.log("hitted");

    if (type !== loginType["mobile-number"]) {
      return res.status(400).json({
        message: ERROR_RESPONSE.invalidLogin,
        code: 400,
      });
    }

    const user = await userModel.findOne({ mobileNumber: mobileNumber.trim() });
    if (!user) {
      return res.status(404).json({
        message: ERROR_RESPONSE.userNotFound,
        code: 404,
      });
    }

    const otp = generateOTP();
    user.OTP = otp;
    user.otpExpires = moment().add(5, "minutes").toDate();
    await user.save();

    // await sendOTP(user.mobileNumber, otp);

    return res.status(200).json({
      message: SUCCESS_RESPONSE.mobileOtpSent,
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
    const { email, loginType: type, socialId } = req.body;

    if (!Object.values(loginType).includes(type)) {
      return res.status(400).json({
        message: ERROR_RESPONSE.invalidLogin,
        code: 400,
      });
    }

    let user = await userModel.findOne({
      socialIds: {
        $elemMatch: {
          id: socialId,
          type,
          email,
        },
      },
    });

    if (!user) {
      user = await userModel.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        return res.status(404).json({
          message: ERROR_RESPONSE.userSignup,
          code: 404,
        });
      }

      const alreadyLinked = user.socialIds?.some(
        (s) => s.id === socialId && s.type === type
      );

      if (!alreadyLinked) {
        user.socialIds = user.socialIds || [];
        user.socialIds.push({ id: socialId, type, email });
        await user.save();
      }
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: SUCCESS_RESPONSE.socialLogin,
      code: 200,
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// export const listUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let { page = 1, limit = 10, search = "" } = req.query;

//     const pageNum = parseInt(page as string, 10);
//     const limitNum = parseInt(limit as string, 10);

//     const query: any = {};

//     if (search && typeof search === "string" && search.trim() !== "") {
//       const regex = new RegExp(search.trim(), "i");
//       query.$or = [
//         { userName: regex },
//         { fullName: regex },
//         { email: regex },
//         { mobileNumber: regex },
//       ];
//     }

//     const totalUsers = await userModel.countDocuments(query);
//     const data = await userModel
//       .find(query)
//       .select("-password -OTP -otpExpires")
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum);

//     const totalPages = Math.ceil(totalUsers / limitNum);
//     const nextHit = pageNum < totalPages;

//     return res.status(200).json({
//       message: "User list fetched successfully.",
//       code: 200,
//       data: {
//         total: totalUsers,
//         page: pageNum,
//         limit: limitNum,
//         totalPages,
//         nextHit,
//         data,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId =  res.locals.user?._id;
    let { page = 1, limit = 10, search = "" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const query: any = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { userName: regex },
        { fullName: regex },
        { email: regex },
        { mobileNumber: regex },
      ];
    }

    query._id = { $ne: currentUserId };

    const totalUsers = await userModel.countDocuments(query);

    const data = await userModel
      .find(query)
      .select("-password -OTP -otpExpires")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const usersWithLastMsg = await Promise.all(
      data.map(async (user) => {
        const lastMsg = await chatModel
          .findOne({
            $or: [
              { senderId: currentUserId, receiverId: user._id },
              { senderId: user._id, receiverId: currentUserId },
            ],
          })
          .select("message mediaUrl mediaType senderId receiverId createdAt isRead")
          .lean();

        return {
          ...user,
          lastMessage: lastMsg
            ? {
                message: lastMsg.message || (lastMsg.mediaUrl ? " Media" : ""),
                mediaType: lastMsg.mediaType,
                createdAt: (lastMsg as any).createdAt,
                isSentByMe: String((lastMsg as any).senderId) === String(currentUserId),
                isRead: (lastMsg as any).isRead,
              }
            : null,
        };
      })
    );

    const totalPages = Math.ceil(totalUsers / limitNum);
    const nextHit = pageNum < totalPages;

    return res.status(200).json({
      message: "User list fetched successfully.",
      code: 200,
      data: {
        total: totalUsers,
        page: pageNum,
        limit: limitNum,
        totalPages,
        nextHit,
        data: usersWithLastMsg,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const listUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const currentUserId = new mongoose.Types.ObjectId(res.locals.user?._id);
//     let { page = 1, limit = 10, search = "" } = req.query;

//     const pageNum = parseInt(page as string, 10);
//     const limitNum = parseInt(limit as string, 10);

//     const matchQuery: any = { _id: { $ne: currentUserId } };

//     if (search && typeof search === "string" && search.trim() !== "") {
//       const regex = new RegExp(search.trim(), "i");
//       matchQuery.$or = [
//         { userName: regex },
//         { fullName: regex },
//         { email: regex },
//         { mobileNumber: regex },
//       ];
//     }

//     const usersWithLastMsg = await userModel.aggregate([
//       { $match: matchQuery },
//       { $skip: (pageNum - 1) * limitNum },
//       { $limit: limitNum },
//       {
//         $lookup: {
//           from: "chats",
//           let: { userId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $or: [
//                     {
//                       $and: [
//                         { $eq: ["$senderId", "$$userId"] },
//                         { $eq: ["$receiverId", currentUserId] },
//                       ],
//                     },
//                     {
//                       $and: [
//                         { $eq: ["$receiverId", "$$userId"] },
//                         { $eq: ["$senderId", currentUserId] },
//                       ],
//                     },
//                   ],
//                 },
//               },
//             },
//             { $sort: { createdAt: -1 } },
//             { $limit: 1 },
//             {
//               $project: {
//                 message: 1,
//                 mediaUrl: 1,
//                 mediaType: 1,
//                 senderId: 1,
//                 receiverId: 1,
//                 createdAt: 1,
//                 isRead: 1,
//               },
//             },
//           ],
//           as: "lastMessage",
//         },
//       },
//       {
//         $unwind: {
//           path: "$lastMessage",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           password: 0,
//           OTP: 0,
//           otpExpires: 0,
//           lastMessage: {
//             message: {
//               $ifNull: [
//                 "$lastMessage.message",
//                 {
//                   $cond: [
//                     { $ifNull: ["$lastMessage.mediaUrl", false] },
//                     "Media",
//                     null,
//                   ],
//                 },
//               ],
//             },
//             mediaType: "$lastMessage.mediaType",
//             createdAt: "$lastMessage.createdAt",
//             isSentByMe: { $eq: ["$lastMessage.senderId", currentUserId] },
//             isRead: "$lastMessage.isRead",
//           },
//         },
//       },
//     ]);

//     const totalUsers = await userModel.countDocuments(matchQuery);
//     const totalPages = Math.ceil(totalUsers / limitNum);
//     const nextHit = pageNum < totalPages;

//     return res.status(200).json({
//       message: "User list fetched successfully.",
//       code: 200,
//       data: {
//         total: totalUsers,
//         page: pageNum,
//         limit: limitNum,
//         totalPages,
//         nextHit,
//         data: usersWithLastMsg,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
