// import mongoose from "mongoose";

// export const connectDB = mongoose
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Petpalz")
//   //.then(() => {
   // mongoose.set({ debug: true });
   // console.log("MongoDB connected");
 // })
 // .catch((error) => console.error("MongoDB connection error:", error));

 import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Petpalz"
    );
    mongoose.set("debug", true); 
    console.log("MongoDB connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
