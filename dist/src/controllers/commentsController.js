"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByPost = exports.deleteComment = exports.updateComment = exports.addComment = void 0;
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const message_1 = require("../utils/message");
dotenv_1.default.config();
const addComment = async (req, res, next) => {
    try {
        const { postId, text, parentCommentId, userId } = req.body;
        const postExists = await postModel_1.default.findById(postId);
        if (!postExists) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.postNotFound });
        }
        const comment = await commentsModel_1.default.create({
            postId,
            userId,
            text,
            parentCommentId: parentCommentId || null,
        });
        await postModel_1.default.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });
        return res.status(201).json({
            code: 201,
            message: message_1.SUCCESS_RESPONSE.commentAdded,
            data: comment,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addComment = addComment;
const updateComment = async (req, res, next) => {
    try {
        const { id, text, userId } = req.body;
        const comment = await commentsModel_1.default.findById(id);
        if (!comment) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.commentNotFound });
        }
        if (comment.userId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ code: 403, message: message_1.ERROR_RESPONSE.unauthorizedAction });
        }
        const hoursPassed = (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60 * 60);
        if (hoursPassed > 24) {
            return res.status(403).json({
                code: 403,
                message: message_1.ERROR_RESPONSE.cannotEditAfter24h,
            });
        }
        comment.text = text;
        comment.updatedAt = new Date();
        await comment.save();
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.commentUpdated,
            data: comment,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res, next) => {
    try {
        const { id, userId } = req.body;
        const comment = await commentsModel_1.default.findById(id);
        if (!comment) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.commentNotFound });
        }
        if (comment.userId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ code: 403, message: message_1.ERROR_RESPONSE.unauthorizedAction });
        }
        await comment.deleteOne();
        await postModel_1.default.updateOne({ _id: comment.get("postId"), commentCount: { $gt: 0 } }, { $inc: { commentCount: -1 } });
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.commentDeleted,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteComment = deleteComment;
const getCommentsByPost = async (req, res, next) => {
    try {
        const { postId } = req.body;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalComments = await commentsModel_1.default.countDocuments({ postId });
        const comments = await commentsModel_1.default
            .find({ postId })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.commentsFetched,
            data: {
                comments,
                pagination: {
                    totalComments,
                    currentPage: page,
                    totalPages: Math.ceil(totalComments / limit),
                    pageSize: limit,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCommentsByPost = getCommentsByPost;
//# sourceMappingURL=commentsController.js.map