import type { Request, Response, NextFunction } from "express";
import userModel from "../models/userModels";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface DecodedToken extends JwtPayload {
  _id: string; 
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        code: 401,
        status: "failed",
        message: "Unauthorized request: No token",
      });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.PRIVATE_KEY as string
    ) as DecodedToken;

    const user = await userModel.findById(decodedToken._id);

    if (!user) {
      res.status(401).json({
        code: 401,
        status: "failed",
        message: "Unauthorized request: User not found",
      });
      return;
    }

  
  res.locals.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      status: "failed",
      error: error?.message,
      message: "Invalid Access Token",
    });
  }
};
