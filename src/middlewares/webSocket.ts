import { Server as SocketIOServer } from "socket.io";
import http from "http";
import Chat from "../models/chatModel"; 
import mongoose from "mongoose";

interface UserSocketMap {
  [userId: string]: string;
}

export const setupSocketIO = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
  });

  const userSocketMap: UserSocketMap = {};


  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

   
    socket.on("register", (userId: string) => {
      if (!userId) return;
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

  
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, message } = data;

      
        const newMessage = await Chat.create({
          senderId: new mongoose.Types.ObjectId(senderId),
          receiverId: new mongoose.Types.ObjectId(receiverId),
          message,
        });

     
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", newMessage);
        }

        
        socket.emit("message_sent", newMessage);
      } catch (error) {
        console.error("Error in send_message:", error);
      }
    });


    socket.on("get_chat_history", async (data) => {
      try {
        const { senderId, receiverId } = data;

        const chatHistory = await Chat.find({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        });

        socket.emit("chat_history", chatHistory);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    });


    socket.on("mark_as_read", async (data) => {
      try {
        const { senderId, receiverId } = data;
        await Chat.updateMany(
          { senderId, receiverId, isRead: false },
          { $set: { isRead: true } }
        );
        socket.emit("messages_marked_read", { senderId, receiverId });
      } catch (error) {
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
