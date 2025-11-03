import mongoose, { Schema, Document } from "mongoose";
import {NotificationType} from "../utils/enum";


export interface INotification extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
    collection: "Notification",
    versionKey: false,
  }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
