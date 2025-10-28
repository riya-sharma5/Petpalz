"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const chatModel_1 = __importDefault(require("./models/chatModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            credentials: true,
        },
    });
    const userSocketMap = {};
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("register", (userId) => {
            if (!userId)
                return;
            userSocketMap[userId] = socket.id;
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });
        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, message } = data;
                const newMessage = await chatModel_1.default.create({
                    senderId: new mongoose_1.default.Types.ObjectId(senderId),
                    receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
                    message,
                });
                const receiverSocketId = userSocketMap[receiverId];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", newMessage);
                }
                socket.emit("message_sent", newMessage);
            }
            catch (error) {
                console.error("Error in send_message:", error);
            }
        });
        socket.on("get_chat_history", async (data) => {
            try {
                const { senderId, receiverId } = data;
                const chatHistory = await chatModel_1.default.find({
                    $or: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId },
                    ],
                });
                socket.emit("chat_history", chatHistory);
            }
            catch (error) {
                console.error("Error fetching chat history:", error);
            }
        });
        socket.on("mark_as_read", async (data) => {
            try {
                const { senderId, receiverId } = data;
                await chatModel_1.default.updateMany({ senderId, receiverId, isRead: false }, { $set: { isRead: true } });
                socket.emit("messages_marked_read", { senderId, receiverId });
            }
            catch (error) {
                console.error("Error marking messages as read:", error);
            }
        });
        socket.on("disconnect", () => {
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
//# sourceMappingURL=webSocket.js.map