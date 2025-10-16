import mongoose, { Document } from "mongoose";
export declare enum loginType {
    "email" = "0",
    "mobile-number" = "1",
    "google" = "2",
    "facebook" = "3",
    "twitter" = "4",
    "apple" = "5"
}
interface SocialId {
    id: string;
    type: loginType;
    email: string;
}
export interface IUser extends Document {
    fullName: string;
    password: string;
    email: string;
    userName: string;
    dateOfBirth: Date;
    isEmailVerified: boolean;
    mobileNumber: string;
    OTP?: string;
    otpExpires?: Date;
    socialIds?: SocialId[];
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModels.d.ts.map