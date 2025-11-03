import { Server as SocketIOServer } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import jwt from "jsonwebtoken";
import Chat from "../models/chatModel";
import userModel from "../models/userModels";
import type { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NotificationType } from "../utils/enum";
import Notification from "../models/notificationModel";
dotenv.config();

interface UserSocketMap {
  [userId: string]: string;
}

function toObjectId(id: string) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId: " + id);
  }
  return new mongoose.Types.ObjectId(id);
}

interface DecodedToken extends JwtPayload {
  _id: string;
}

export const setupSocketIO = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      // credentials: false,
    },
  });

  const userSocketMap: UserSocketMap = {};

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) throw new Error(ERROR_RESPONSE.noTokenProvided);

      const decoded = jwt.verify(
        token,
        process.env.PRIVATE_KEY as string
      ) as DecodedToken;
      const user = await userModel.findById(decoded._id);
      if (!user) throw new Error(ERROR_RESPONSE.userNotFound);

      (socket as any).user = user;
      next();
    } catch (err: any) {
      console.error(ERROR_RESPONSE.authentication, err.message);
      next(new Error(`Unauthorized: ${err.message}`));
    }
  });

  io.on("connect", (socket) => {
    try {
      const user = (socket as any).user;
      console.log(
        `Authenticated user connected: ${user._id}, socket: ${socket.id}`
      );

      userSocketMap[user._id] = socket.id;

      io.emit("user_online", { userId: user._id, online: true });

      socket.on("join_room", (data) => {
        try {
          if (!data || typeof data !== "object" || !data.receiverId) {
            console.warn(" join_room received invalid payload:", data);
            return;
          }
          const { receiverId } = data;
          if (!receiverId) throw new Error("receiverId is required");
          console.log("receiverId", receiverId);

          const userObjectId = toObjectId(user._id);
          const receiverObjectId = toObjectId(receiverId);

          const roomId = [userObjectId.toString(), receiverObjectId.toString()]
            .sort()
            .join("_");
          socket.join(roomId);

          if (!(socket as any).roomsJoined) {
            (socket as any).roomsJoined = new Set();
          }
          (socket as any).roomsJoined.add(roomId);

          socket.emit("room_joined", { roomId });

          console.log(`User ${user._id} joined room ${roomId}`);
        } catch (err: any) {
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("leave_room", (data) => {
        try {
          const { receiverId } = data;
          if (!receiverId) throw new Error("ReceiverId is required");

          const roomId = [user._id.toString(), receiverId].sort().join("_");
          socket.leave(roomId);
          console.log(`User ${user._id} left room ${roomId}`);
        } catch (err: any) {
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

          const newNotification = await Notification.create({
            senderId: senderObjectId,
            receiverId: receiverObjectId,
            type,
            content,
          });

          const receiverSocketId = userSocketMap[receiverId];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit(
              "receive_notification",
              newNotification
            );
          }

          socket.emit("notification_sent", newNotification);
        } catch (err: any) {
          console.error("send_notification error:", err);
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("get_notifications", async () => {
        try {
          const notifications = await Notification.find({
            receiverId: user._id,
          }).sort({ createdAt: -1 });

          socket.emit("notifications_list", notifications);
        } catch (err: any) {
          console.error("get_notifications error:", err);
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("mark_notification_read", async (data) => {
        try {
          const { notificationId } = data;
          if (!notificationId) throw new Error("notificationId required");

          const notification = await Notification.findById(notificationId);
          if (!notification) throw new Error("Notification not found");
          if (notification.receiverId.toString() !== user._id.toString())
            throw new Error("Not authorized");

          notification.isRead = true;
          await notification.save();

          socket.emit("notification_marked_read", { notificationId });
        } catch (err: any) {
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

          const newMessage = await Chat.create({
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
        } catch (err: any) {
          console.error("send_message error:", err);
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("get_chat_history", async (data) => {
        try {
          const { receiverId } = data;
          if (!receiverId) throw new Error("receiverId is required");

          const chatHistory = await Chat.find({
            $or: [
              { senderId: user._id, receiverId },
              { senderId: receiverId, receiverId: user._id },
            ],
          });

          socket.emit("chat_history", chatHistory);
        } catch (err: any) {
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
          if (!receiverId) throw new Error("receiverId is required");

          const roomId = [user._id.toString(), receiverId].sort().join("_");
          socket.to(roomId).emit("typing", { senderId: user._id });
        } catch (err: any) {
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("stop_typing", (data) => {
        try {
          const { receiverId } = data;
          if (!receiverId) throw new Error("receiverId is required");

          const roomId = [user._id.toString(), receiverId].sort().join("_");
          socket.to(roomId).emit("stop_typing", { senderId: user._id });
        } catch (err: any) {
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("delete_message", async (data) => {
        try {
          const { messageId } = data;
          if (!messageId) throw new Error("messageId required");

          const chat = await Chat.findById(messageId);
          if (!chat) throw new Error("Message not found");
          if (chat.senderId.toString() !== user._id.toString())
            throw new Error("Not authorized");

          await chat.deleteOne();
          const roomId = [chat.senderId.toString(), chat.receiverId.toString()]
            .sort()
            .join("_");
          io.to(roomId).emit("message_deleted", { messageId });
        } catch (err: any) {
          console.error("delete_message error:", err);
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("mark_as_read", async (data) => {
        try {
          const { receiverId } = data;
          if (!receiverId) throw new Error("receiverId required");

          const senderObjectId = toObjectId(user._id);
          const receiverObjectId = toObjectId(receiverId);

          await Chat.updateMany(
            { senderId: receiverId, receiverId: user._id, isRead: false },
            { $set: { isRead: true } }
          );
          console.log("marked read");
          socket.emit("messages_marked_read", { receiverId });
        } catch (err: any) {
          console.error("mark_as_read error:", err);
          socket.emit("error", { message: err.message });
        }
      });

      socket.on("disconnect", () => {
        try {
          delete userSocketMap[user._id];
          console.log(`User ${user._id} disconnected`);
          io.emit("user_offline", { userId: user._id, online: false });
        } catch (err: any) {
          console.error("disconnect error:", err);
        }
      });

      socket.on("error", (err: any) => {
        console.error("Socket error:", err);
      });
    } catch (err: any) {
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
