import mongoose from "mongoose";
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
    authProvider: String;
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModels.d.ts.map