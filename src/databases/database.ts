import mongoose from "mongoose";

export const connectDB = mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Petpalz")
  //.then(() => {
   // mongoose.set({ debug: true });
   // console.log("MongoDB connected");
 // })
 // .catch((error) => console.error("MongoDB connection error:", error));