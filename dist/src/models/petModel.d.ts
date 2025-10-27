import mongoose, { Document } from "mongoose";
import { Gender, Species } from "../utils/enum";
export interface IPet extends Document {
    petName: string;
    species: Species;
    breed: string;
    gender: Gender;
    dateOfBirth: Date;
    age: number;
    userId: mongoose.Types.ObjectId;
}
declare const petModel: mongoose.Model<IPet, {}, {}, {}, mongoose.Document<unknown, {}, IPet, {}, {}> & IPet & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default petModel;
//# sourceMappingURL=petModel.d.ts.map