import mongoose from "mongoose";
export declare enum loginType {
    "email" = "0",
    "mobile-number" = "1",
    "google" = "2",
    "facebook" = "3",
    "twitter" = "4",
    "apple" = "5"
}
export interface IUser {
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
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModels.d.ts.map