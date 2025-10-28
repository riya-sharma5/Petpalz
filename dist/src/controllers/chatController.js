"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserList = exports.deleteMessage = exports.markMessagesAsRead = exports.getChatHistory = exports.sendMessage = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const enum_1 = require("../utils/enum");
const message_1 = require("../utils/message");
const regex_1 = require("../utils/regex");
const sendMessage = async (req, res, next) => {
    try {
        const { senderId, receiverId, message, mediaUrl, mediaType } = req.body;
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
                default:
                    regex = /.*/;
            }
            if (!regex.test(mediaUrl)) {
                const ext = mediaUrl.split(".").pop();
                const errorMessage = `Media type '${mediaType}' does not match file type '${ext}'.`;
                if (res) {
                    return res.status(400).json({ code: 400, message: errorMessage });
                }
                else {
                    throw new Error(errorMessage);
                }
            }
        }
        const chat = await chatModel_1.default.create({
            senderId,
            receiverId,
            message,
            mediaUrl: mediaUrl || "",
            mediaType: mediaType || enum_1.MediaType.NONE,
        });
        if (res) {
            return res.status(201).json({
                code: 201,
                message: message_1.SUCCESS_RESPONSE.messageSent,
                data: chat,
            });
        }
        return chat;
    }
    catch (error) {
        next?.(error);
    }
};
exports.sendMessage = sendMessage;
const getChatHistory = async (req, res, next) => {
    try {
        const { userId, otherUserId } = req.params;
        const messages = await chatModel_1.default.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
            ],
        })
            .lean();
        if (res) {
            return res.status(200).json({
                code: 200,
                message: message_1.SUCCESS_RESPONSE.messagesFetched,
                data: messages,
            });
        }
        return messages;
    }
    catch (error) {
        next?.(error);
    }
};
exports.getChatHistory = getChatHistory;
const markMessagesAsRead = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body;
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
        const chat = await chatModel_1.default.findById(id);
        if (!chat) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.messageNotFound });
        }
        if (chat.senderId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ code: 403, message: message_1.ERROR_RESPONSE.unauthorizedAction });
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
    }
    catch (error) {
    }
};
exports.getUserList = getUserList;
//# sourceMappingURL=chatController.js.map