"use strict";
// import { Request, Response, NextFunction } from "express";
// import ChatModel from "../models/chatModel";
// import { MediaType } from "../utils/enum";
// import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
// import { imageRegex, videoRegex, pdfRegex } from "../utils/regex";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatRooms = exports.getUserList = exports.deleteMessage = exports.markMessagesAsRead = exports.getChatHistory = exports.sendMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModels_1 = __importDefault(require("../models/userModels"));
const enum_1 = require("../utils/enum");
const message_1 = require("../utils/message");
const regex_1 = require("../utils/regex");
function toObjectId(id) {
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose_1.default.Types.ObjectId(id);
}
const sendMessage = async (req, res, next) => {
    try {
        const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).json({
                code: 400,
                message: "Sender and receiver IDs are required.",
            });
        }
        if (mediaUrl && mediaType && mediaType !== enum_1.MediaType.NONE) {
            let regex;
            switch (mediaType) {
                case enum_1.MediaType.IMAGE:
                    regex = regex_1.imageRegex;
                    break;
                case enum_1.MediaType.VIDEO:
                    regex = regex_1.videoRegex;
                    break;
                case enum_1.MediaType.PDF:
                    regex = regex_1.pdfRegex;
                    break;
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
        const chat = await chatModel_1.default.create({
            senderId: toObjectId(senderId),
            receiverId: toObjectId(receiverId),
            message: message || "",
            mediaUrl: mediaUrl || "",
            mediaType: mediaType || enum_1.MediaType.NONE,
        });
        return res.status(201).json({
            code: 201,
            message: message_1.SUCCESS_RESPONSE.messageSent,
            data: chat,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendMessage = sendMessage;
const getChatHistory = async (req, res, next) => {
    try {
        const { userId, otherUserId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        if (!userId || !otherUserId) {
            return res.status(400).json({
                code: 400,
                message: "Both userId and otherUserId are required.",
            });
        }
        const messages = await chatModel_1.default.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
            ],
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await chatModel_1.default.countDocuments({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
            ],
        });
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.messagesFetched,
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
    }
    catch (error) {
        next(error);
    }
};
exports.getChatHistory = getChatHistory;
const markMessagesAsRead = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).json({
                code: 400,
                message: "Sender and receiver IDs are required.",
            });
        }
        await chatModel_1.default.updateMany({ senderId, receiverId, isRead: false }, { $set: { isRead: true } });
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.messagesMarkedRead,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markMessagesAsRead = markMessagesAsRead;
const deleteMessage = async (req, res, next) => {
    try {
        const { userId, id } = req.body;
        if (!id || !userId) {
            return res.status(400).json({
                code: 400,
                message: "Message ID and user ID are required.",
            });
        }
        const chat = await chatModel_1.default.findById(id);
        if (!chat) {
            return res.status(404).json({
                code: 404,
                message: message_1.ERROR_RESPONSE.messageNotFound,
            });
        }
        if (chat.senderId.toString() !== userId.toString()) {
            return res.status(403).json({
                code: 403,
                message: message_1.ERROR_RESPONSE.unauthorizedAction,
            });
        }
        await chat.deleteOne();
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.messageDeleted,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMessage = deleteMessage;
const getUserList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await userModels_1.default.find()
            .skip(skip)
            .limit(limit)
            .select("_id name email")
            .lean();
        const total = await userModels_1.default.countDocuments();
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
    }
    catch (error) {
        next(error);
    }
};
exports.getUserList = getUserList;
const getChatRooms = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                code: 400,
                message: "User ID is required.",
            });
        }
        const chats = await chatModel_1.default.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .sort({ createdAt: -1 })
            .lean();
        const rooms = chats.reduce((acc, chat) => {
            const otherId = chat.senderId.toString() === userId
                ? chat.receiverId.toString()
                : chat.senderId.toString();
            if (!acc[otherId])
                acc[otherId] = chat;
            return acc;
        }, {});
        return res.status(200).json({
            code: 200,
            message: "Chat rooms fetched successfully.",
            data: Object.values(rooms),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getChatRooms = getChatRooms;
//# sourceMappingURL=chatController.js.map