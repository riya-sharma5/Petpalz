import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { likeType } from "../utils/enum";


export interface ILike extends Document {
  userId: ObjectId;
  entityId?: ObjectId;
  type: likeType;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: likeType,
      required: true,
    },
  },

  {
    timestamps: true,
    collection: "likes",
    versionKey: false,
  }
);

likeSchema.index({ entityId: 1, userId: 1 }, { unique: true });

const likeModel = mongoose.model<ILike>("likes", likeSchema);
export default likeModel;
