import { Request, Response, NextFunction } from "express";
import ChatModel from "../models/chatModel";
import { MediaType } from "../utils/enum";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import { imageRegex, videoRegex, pdfRegex } from "../utils/regex";

export const sendMessage = async (
  req: Request ,
  res?: Response,
  next?: NextFunction
) => {
  try {
    const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;

    if (mediaUrl && mediaType && mediaType !== MediaType.NONE) {
      let regex: RegExp;

      switch (mediaType) {
        case MediaType.IMAGE:
          regex = imageRegex;
          break;
        case MediaType.VIDEO:
          regex = videoRegex;
          break;
        case MediaType.PDF:
          regex = pdfRegex;
          break;
        default:
          regex = /.*/; 
      }

      if (!regex.test(mediaUrl)) {
        const ext = mediaUrl.split(".").pop();
        const errorMessage = `Media type '${mediaType}' does not match file type '${ext}'.`;
        if (res) {
          return res.status(400).json({ code: 400, message: errorMessage });
        } else {
          throw new Error(errorMessage);
        }
      }
    }

    const chat = await ChatModel.create({
      senderId,
      receiverId,
      message,
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || MediaType.NONE,
    });

    if (res) {
      return res.status(201).json({
        code: 201,
        message: SUCCESS_RESPONSE.messageSent,
        data: chat,
      });
    }

    return chat;
  } catch (error) {
    next?.(error);
  }
};


export const getChatHistory = async (
  req: Request,
  res?: Response,
  next?: NextFunction
) => {
  try {
    const { userId, otherUserId } = req.params;

    const messages = await ChatModel.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
    .lean();

    if (res) {
      return res.status(200).json({
        code: 200,
        message: SUCCESS_RESPONSE.messagesFetched,
        data: messages,
      });
    }

    return messages;
  } catch (error) {
    next?.(error);
  }
};

export const markMessagesAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { senderId, receiverId } = req.body;

    await ChatModel.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.messagesMarkedRead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async ( 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, id } = req.body;

    const chat = await ChatModel.findById(id);
    if (!chat) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.messageNotFound });
    }

    if (chat.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ code: 403, message: ERROR_RESPONSE.unauthorizedAction });
    }

    await chat.deleteOne();

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.messageDeleted,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserList = async(req: Request, res: Response, next: NextFunction) =>{
  try{
 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

  } catch(error){

  }
}