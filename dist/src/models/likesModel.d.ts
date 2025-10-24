import mongoose, { Document, ObjectId } from "mongoose";
import { likeType } from "../utils/enum";
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