import mongoose, { Document } from "mongoose";
export interface IComment extends Document {
    postId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    text: string;
    parentCommentId?: mongoose.Types.ObjectId | null;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, {}> & IComment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=commentsModel.d.ts.map