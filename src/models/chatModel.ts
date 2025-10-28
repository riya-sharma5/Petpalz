import mongoose, { Schema, Document } from "mongoose";
import { MediaType } from "../utils/enum"; 

export interface IChat extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  mediaUrl: string;
  mediaType: MediaType;
  isRead: boolean;
}

const chatSchema = new Schema<IChat>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    mediaType: {
      type: String,
      enum: Object.values(MediaType),
      default: MediaType.NONE,
    },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Chat",
    versionKey: false,
  }
);

export default mongoose.model<IChat>("Chat", chatSchema);
