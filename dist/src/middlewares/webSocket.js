"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const message_1 = require("../utils/message");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModels_1 = __importDefault(require("../models/userModels"));
const dotenv = __importStar(require("dotenv"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
dotenv.config();
function toObjectId(id) {
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ObjectId: " + id);
    }
    return new mongoose_1.default.Types.ObjectId(id);
}
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            // credentials: false,
        },
    });
    const userSocketMap = {};
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token)
                throw new Error(message_1.ERROR_RESPONSE.noTokenProvided);
            const decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
            const user = await userModels_1.default.findById(decoded._id);
            if (!user)
                throw new Error(message_1.ERROR_RESPONSE.userNotFound);
            socket.user = user;
            next();
        }
        catch (err) {
            console.error(message_1.ERROR_RESPONSE.authentication, err.message);
            next(new Error(`Unauthorized: ${err.message}`));
        }
    });
    io.on("connect", (socket) => {
        try {
            const user = socket.user;
            console.log(`Authenticated user connected: ${user._id}, socket: ${socket.id}`);
            userSocketMap[user._id] = socket.id;
            io.emit("user_online", { userId: user._id, online: true });
            socket.on("join_room", (data) => {
                try {
                    if (!data || typeof data !== "object" || !data.receiverId) {
                        console.warn(" join_room received invalid payload:", data);
                        return;
                    }
                    const { receiverId } = data;
                    if (!receiverId)
                        throw new Error("receiverId is required");
                    console.log("receiverId", receiverId);
                    const userObjectId = toObjectId(user._id);
                    const receiverObjectId = toObjectId(receiverId);
                    const roomId = [userObjectId.toString(), receiverObjectId.toString()]
                        .sort()
                        .join("_");
                    socket.join(roomId);
                    if (!socket.roomsJoined) {
                        socket.roomsJoined = new Set();
                    }
                    socket.roomsJoined.add(roomId);
                    socket.emit("room_joined", { roomId });
                    console.log(`User ${user._id} joined room ${roomId}`);
                }
                catch (err) {
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("leave_room", (data) => {
                try {
                    const { receiverId } = data;
                    if (!receiverId)
                        throw new Error("ReceiverId is required");
                    const roomId = [user._id.toString(), receiverId].sort().join("_");
                    socket.leave(roomId);
                    console.log(`User ${user._id} left room ${roomId}`);
                }
                catch (err) {
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("send_notification", async (data) => {
                try {
                    const { receiverId, type, content } = data;
                    if (!receiverId || !type || !content)
                        throw new Error("receiverId, type, and content are required");
                    const senderObjectId = toObjectId(user._id);
                    const receiverObjectId = toObjectId(receiverId);
                    const newNotification = await notificationModel_1.default.create({
                        senderId: senderObjectId,
                        receiverId: receiverObjectId,
                        type,
                        content,
                    });
                    const receiverSocketId = userSocketMap[receiverId];
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit("receive_notification", newNotification);
                    }
                    socket.emit("notification_sent", newNotification);
                }
                catch (err) {
                    console.error("send_notification error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("get_notifications", async () => {
                try {
                    const notifications = await notificationModel_1.default.find({
                        receiverId: user._id,
                    }).sort({ createdAt: -1 });
                    socket.emit("notifications_list", notifications);
                }
                catch (err) {
                    console.error("get_notifications error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("mark_notification_read", async (data) => {
                try {
                    const { notificationId } = data;
                    if (!notificationId)
                        throw new Error("notificationId required");
                    const notification = await notificationModel_1.default.findById(notificationId);
                    if (!notification)
                        throw new Error("Notification not found");
                    if (notification.receiverId.toString() !== user._id.toString())
                        throw new Error("Not authorized");
                    notification.isRead = true;
                    await notification.save();
                    socket.emit("notification_marked_read", { notificationId });
                }
                catch (err) {
                    console.error("mark_notification_read error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("send_message", async (data) => {
                try {
                    const { receiverId, message } = data;
                    if (!receiverId || !message)
                        throw new Error("receiverId and message are required");
                    const senderObjectId = toObjectId(user._id);
                    const receiverObjectId = toObjectId(receiverId);
                    const newMessage = await chatModel_1.default.create({
                        senderId: senderObjectId,
                        receiverId: receiverObjectId,
                        message,
                    });
                    const roomId = [
                        senderObjectId.toString(),
                        receiverObjectId.toString(),
                    ]
                        .sort()
                        .join("_");
                    io.to(roomId).emit("receive_message", newMessage);
                    socket.emit("message_sent", newMessage);
                }
                catch (err) {
                    console.error("send_message error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("get_chat_history", async (data) => {
                try {
                    const { receiverId } = data;
                    if (!receiverId)
                        throw new Error("receiverId is required");
                    const chatHistory = await chatModel_1.default.find({
                        $or: [
                            { senderId: user._id, receiverId },
                            { senderId: receiverId, receiverId: user._id },
                        ],
                    });
                    socket.emit("chat_history", chatHistory);
                }
                catch (err) {
                    console.error("get_chat_history error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            //   socket.on("send_notification", (data)=>{
            // console.log("Notification Received: ", data);
            // io.emit("receive_notification", data)
            //   })
            socket.on("typing", (data) => {
                try {
                    const { receiverId } = data;
                    if (!receiverId)
                        throw new Error("receiverId is required");
                    const roomId = [user._id.toString(), receiverId].sort().join("_");
                    socket.to(roomId).emit("typing", { senderId: user._id });
                }
                catch (err) {
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("stop_typing", (data) => {
                try {
                    const { receiverId } = data;
                    if (!receiverId)
                        throw new Error("receiverId is required");
                    const roomId = [user._id.toString(), receiverId].sort().join("_");
                    socket.to(roomId).emit("stop_typing", { senderId: user._id });
                }
                catch (err) {
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("delete_message", async (data) => {
                try {
                    const { messageId } = data;
                    if (!messageId)
                        throw new Error("messageId required");
                    const chat = await chatModel_1.default.findById(messageId);
                    if (!chat)
                        throw new Error("Message not found");
                    if (chat.senderId.toString() !== user._id.toString())
                        throw new Error("Not authorized");
                    await chat.deleteOne();
                    const roomId = [chat.senderId.toString(), chat.receiverId.toString()]
                        .sort()
                        .join("_");
                    io.to(roomId).emit("message_deleted", { messageId });
                }
                catch (err) {
                    console.error("delete_message error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("mark_as_read", async (data) => {
                try {
                    const { receiverId } = data;
                    if (!receiverId)
                        throw new Error("receiverId required");
                    const senderObjectId = toObjectId(user._id);
                    const receiverObjectId = toObjectId(receiverId);
                    await chatModel_1.default.updateMany({ senderId: receiverId, receiverId: user._id, isRead: false }, { $set: { isRead: true } });
                    console.log("marked read");
                    socket.emit("messages_marked_read", { receiverId });
                }
                catch (err) {
                    console.error("mark_as_read error:", err);
                    socket.emit("error", { message: err.message });
                }
            });
            socket.on("disconnect", () => {
                try {
                    delete userSocketMap[user._id];
                    console.log(`User ${user._id} disconnected`);
                    io.emit("user_offline", { userId: user._id, online: false });
                }
                catch (err) {
                    console.error("disconnect error:", err);
                }
            });
            socket.on("error", (err) => {
                console.error("Socket error:", err);
            });
        }
        catch (err) {
            console.error("Connect handling error:", err);
            socket.emit("connect_error", { message: err.message });
        }
    });
    io.on("connect_error", (err) => {
        console.error(" connect_error:", err.message);
    });
    io.on("error", (err) => {
        console.error("Socket.IO error:", err);
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
//# sourceMappingURL=webSocket.js.map