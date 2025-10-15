import mongoose, { Document, Schema } from "mongoose";


export enum loginType {
  "email" = "0",
  "mobile-number" = "1",
  "google" = "2",
  "facebook" = "3",
  "twitter" = "4",
  "apple" = "5"
}

export interface IUser  {
  fullName: string;
  password: string;
  email: string;
  userName: string;
  dateOfBirth: Date;
  isEmailVerified: boolean;
  mobileNumber: string;
  OTP?: string;
  otpExpires?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      
    },
    fullName: {
      type: String,
      required: false,
      
    },
    email: {
      type: String,
      required: true,
      unique: true,
      
    },
    mobileNumber: {
      type: String,
      required: false,
      unique: true,
      
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    OTP: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

const userModel = mongoose.model<IUser>("users", userSchema);
export default userModel;
