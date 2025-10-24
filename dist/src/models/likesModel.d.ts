import mongoose, { Document, ObjectId } from "mongoose";
export declare enum likeType {
    Post = "0",
    Comment = "1"
}
export interface ILike extends Document {
    userId: ObjectId;
    entityId?: ObjectId;
    type: likeType;
}
declare const likeModel: mongoose.Model<ILike, {}, {}, {}, mongoose.Document<unknown, {}, ILike, {}, {}> & ILike & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default likeModel;
//# sourceMappingURL=likesModel.d.ts.map