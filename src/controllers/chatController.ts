// import { Request, Response, NextFunction } from "express";
// import ChatModel from "../models/chatModel";
// import { MediaType } from "../utils/enum";
// import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
// import { imageRegex, videoRegex, pdfRegex } from "../utils/regex";

// export const sendMessage = async (
//   req: Request ,
//   res?: Response,
//   next?: NextFunction
// ) => {
//   try {
//     const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;

//     if (mediaUrl && mediaType && mediaType !== MediaType.NONE) {
//       let regex: RegExp;

//       switch (mediaType) {
//         case MediaType.IMAGE:
//           regex = imageRegex;
//           break;
//         case MediaType.VIDEO:
//           regex = videoRegex;
//           break;
//         case MediaType.PDF:
//           regex = pdfRegex;
//           break;
//         default:
//           regex = /.*/;
//       }

//       if (!regex.test(mediaUrl)) {
//         const ext = mediaUrl.split(".").pop();
//         const errorMessage = `Media type '${mediaType}' does not match file type '${ext}'.`;
//         if (res) {
//           return res.status(400).json({ code: 400, message: errorMessage });
//         } else {
//           throw new Error(errorMessage);
//         }
//       }
//     }

//     const chat = await ChatModel.create({
//       senderId,
//       receiverId,
//       message,
//       mediaUrl: mediaUrl || "",
//       mediaType: mediaType || MediaType.NONE,
//     });

//     if (res) {
//       return res.status(201).json({
//         code: 201,
//         message: SUCCESS_RESPONSE.messageSent,
//         data: chat,
//       });
//     }

//     return chat;
//   } catch (error) {
//     next?.(error);
//   }
// };

// export const getChatHistory = async (
//   req: Request,
//   res?: Response,
//   next?: NextFunction
// ) => {
//   try {
//     const { userId, otherUserId } = req.params;

//     const messages = await ChatModel.find({
//       $or: [
//         { senderId: userId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: userId },
//       ],
//     })
//     .lean();

//     if (res) {
//       return res.status(200).json({
//         code: 200,
//         message: SUCCESS_RESPONSE.messagesFetched,
//         data: messages,
//       });
//     }

//     return messages;
//   } catch (error) {
//     next?.(error);
//   }
// };

// export const markMessagesAsRead = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { senderId, receiverId } = req.body;

//     await ChatModel.updateMany(
//       { senderId, receiverId, isRead: false },
//       { $set: { isRead: true } }
//     );

//     return res.status(200).json({
//       code: 200,
//       message: SUCCESS_RESPONSE.messagesMarkedRead,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userId, id } = req.body;

//     const chat = await ChatModel.findById(id);
//     if (!chat) {
//       return res
//         .status(404)
//         .json({ code: 404, message: ERROR_RESPONSE.messageNotFound });
//     }

//     if (chat.senderId.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ code: 403, message: ERROR_RESPONSE.unauthorizedAction });
//     }

//     await chat.deleteOne();

//     return res.status(200).json({
//       code: 200,
//       message: SUCCESS_RESPONSE.messageDeleted,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUserList = async(req: Request, res: Response, next: NextFunction) =>{
//   try{

//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//   } catch(error){

//   }
// }

// import { Request, Response, NextFunction } from "express";
// import ChatModel from "../models/chatModel";
// import UserModel from "../models/userModels";
// import mongoose from "mongoose";
// import { MediaType } from "../utils/enum";
// import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
// import { imageRegex, videoRegex, pdfRegex } from "../utils/regex";

// export const sendMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;

//     if (!senderId || !receiverId) {
//       return res.status(400).json({
//         code: 400,
//         message: "Sender and receiver are required",
//       });
//     }

//     if (mediaUrl && mediaType && mediaType !== MediaType.NONE) {
//       let regex: RegExp;

//       switch (mediaType) {
//         case MediaType.IMAGE:
//           regex = imageRegex;
//           break;
//         case MediaType.VIDEO:
//           regex = videoRegex;
//           break;
//         case MediaType.PDF:
//           regex = pdfRegex;
//           break;
//         default:
//           regex = /.*/;
//       }

//       if (!regex.test(mediaUrl)) {
//         const ext = mediaUrl.split(".").pop();
//         return res.status(400).json({
//           code: 400,
//           message: `Media type '${mediaType}' does not match file type '${ext}'.`,
//         });
//       }
//     }

//     const chat = await ChatModel.create({
//       senderId: new mongoose.Types.ObjectId(senderId),
//       receiverId: new mongoose.Types.ObjectId(receiverId),
//       message: message || "",
//       mediaUrl: mediaUrl || "",
//       mediaType: mediaType || MediaType.NONE,
//     });

//     return res.status(201).json({
//       code: 201,
//       message: SUCCESS_RESPONSE.messageSent || "Message sent successfully",
//       data: chat,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getChatHistory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//  try {

//     const { userId, otherUserId } = req.params;

//     if (!userId || !otherUserId) {
//       return res.status(400).json({
//         code: 400,
//         message: "User IDs are required",
//       });
//     }

//     const messages = await ChatModel.find({
//       $or: [
//         { senderId: userId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: userId },
//       ],
//     }).lean();

//     return res.status(200).json({
//       code: 200,
//       message: "Chat history fetched",
//       data: messages,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const markMessagesAsRead = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { senderId, receiverId } = req.body;

//     if (!senderId || !receiverId) {
//       return res.status(400).json({
//         code: 400,
//         message: "Sender and receiver IDs required",
//       });
//     }

//     await ChatModel.updateMany(
//       { senderId, receiverId, isRead: false },
//       { $set: { isRead: true } }
//     );

//     return res.status(200).json({
//       code: 200,
//       message: SUCCESS_RESPONSE.messagesMarkedRead || "Messages marked as read",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userId, id } = req.body;

//     if (!id || !userId) {
//       return res.status(400).json({
//         code: 400,
//         message: "Message ID and user ID required",
//       });
//     }

//     const chat = await ChatModel.findById(id);
//     if (!chat) {
//       return res.status(404).json({
//         code: 404,
//         message: ERROR_RESPONSE.messageNotFound || "Message not found",
//       });
//     }

//     if (chat.senderId.toString() !== userId.toString()) {
//       return res.status(403).json({
//         code: 403,
//         message: ERROR_RESPONSE.unauthorizedAction,
//       });
//     }

//     await chat.deleteOne();

//     return res.status(200).json({
//       code: 200,
//       message: SUCCESS_RESPONSE.messageDeleted,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUserList = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     const users = await UserModel.find()
//       .skip(skip)
//       .limit(limit)
//       .select("_id name email ")
//       .lean();

//     const total = await UserModel.countDocuments();

//     return res.status(200).json({
//       code: 200,
//       message: "Users fetched successfully",
//       data: {
//         users,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };


import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ChatModel from "../models/chatModel";
import UserModel from "../models/userModels";
import { MediaType } from "../utils/enum";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import { imageRegex, videoRegex, pdfRegex } from "../utils/regex";


function toObjectId(id: string) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
}


export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;

   
    if (!senderId || !receiverId) {
      return res.status(400).json({
        code: 400,
        message: "Sender and receiver IDs are required.",
      });
    }

  
    if (mediaUrl && mediaType && mediaType !== MediaType.NONE) {
      let regex: RegExp;
      switch (mediaType) {
        case MediaType.IMAGE: regex = imageRegex; break;
        case MediaType.VIDEO: regex = videoRegex; break;
        case MediaType.PDF: regex = pdfRegex; break;
        default: regex = /.*/;
      }

      if (!regex.test(mediaUrl)) {
        const ext = mediaUrl.split(".").pop();
        return res.status(400).json({
          code: 400,
          message: `Media type '${mediaType}' does not match file type '${ext}'.`,
        });
      }
    }

    const chat = await ChatModel.create({
      senderId: toObjectId(senderId),
      receiverId: toObjectId(receiverId),
      message: message || "",
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || MediaType.NONE,
    });

    return res.status(201).json({
      code: 201,
      message: SUCCESS_RESPONSE.messageSent,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};


export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otherUserId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!userId || !otherUserId) {
      return res.status(400).json({
        code: 400,
        message: "Both userId and otherUserId are required.",
      });
    }

    const messages = await ChatModel.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ChatModel.countDocuments({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.messagesFetched,
      data: {
        messages,
        data: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


export const markMessagesAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        code: 400,
        message: "Sender and receiver IDs are required.",
      });
    }

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

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, id } = req.body;

    if (!id || !userId) {
      return res.status(400).json({
        code: 400,
        message: "Message ID and user ID are required.",
      });
    }

    const chat = await ChatModel.findById(id);
    if (!chat) {
      return res.status(404).json({
        code: 404,
        message: ERROR_RESPONSE.messageNotFound,
      });
    }

    if (chat.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        code: 403,
        message: ERROR_RESPONSE.unauthorizedAction,
      });
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


export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .select("_id name email")
      .lean();

    const total = await UserModel.countDocuments();

    return res.status(200).json({
      code: 200,
      message: "Users fetched successfully.",
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        code: 400,
        message: "User ID is required.",
      });
    }

    const chats = await ChatModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const rooms = chats.reduce((acc: Record<string, any>, chat) => {
      const otherId =
        chat.senderId.toString() === userId
          ? chat.receiverId.toString()
          : chat.senderId.toString();
      if (!acc[otherId]) acc[otherId] = chat;
      return acc;
    }, {});

    return res.status(200).json({
      code: 200,
      message: "Chat rooms fetched successfully.",
      data: Object.values(rooms),
    });
  } catch (error) {
    next(error);
  }
};
