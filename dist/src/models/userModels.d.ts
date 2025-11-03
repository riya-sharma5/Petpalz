import mongoose, { Document } from "mongoose";
import { loginType } from "../utils/enum";
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
    createdAt: Date;
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModels.d.ts.map