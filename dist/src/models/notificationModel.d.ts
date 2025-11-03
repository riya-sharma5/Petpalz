import mongoose, { Document } from "mongoose";
import { NotificationType } from "../utils/enum";
export interface INotification extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    type: NotificationType;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Notification;
//# sourceMappingURL=notificationModel.d.ts.map