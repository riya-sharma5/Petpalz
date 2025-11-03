"use strict";
// import mongoose from "mongoose";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// export const connectDB = mongoose
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Petpalz")
//   //.then(() => {
// mongoose.set({ debug: true });
// console.log("MongoDB connected");
// })
// .catch((error) => console.error("MongoDB connection error:", error));
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Petpalz");
        mongoose_1.default.set("debug", true);
        console.log("MongoDB connected:", conn.connection.host);
        return conn;
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map