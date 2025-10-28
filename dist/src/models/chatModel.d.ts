import mongoose, { Document } from "mongoose";
import { MediaType } from "../utils/enum";
export interface IChat extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    mediaUrl: string;
    mediaType: MediaType;
    isRead: boolean;
}
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, {}> & IChat & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=chatModel.d.ts.map