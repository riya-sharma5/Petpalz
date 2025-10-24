import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  parentCommentId?: mongoose.Types.ObjectId | null;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },

    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    collection: "Comment",
    versionKey: false,
  }
);

export default mongoose.model<IComment>("Comment", commentSchema);
