import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  description: string;
  files: string[]; 
  createdBy: mongoose.Types.ObjectId;
}
const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    files: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "posts",
    versionKey: false,
  }
);


const postModel = mongoose.model<IPost>("posts", postSchema);
export default postModel;
