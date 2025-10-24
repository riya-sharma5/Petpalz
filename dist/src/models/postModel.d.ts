import mongoose, { Document } from "mongoose";
export interface IPost extends Document {
    title: string;
    description: string;
    files: string[];
    userId: mongoose.Types.ObjectId;
}
declare const postModel: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default postModel;
//# sourceMappingURL=postModel.d.ts.map