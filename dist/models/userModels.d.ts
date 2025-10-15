import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    fullName: string;
    password: string;
    email: string;
    userName: string;
    DOB: string;
    isEmailVerified: boolean;
    mobileNumber: string;
    OTP?: string | null;
    otpExpires?: Date | string | null;
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModels.d.ts.map