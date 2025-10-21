"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostsByUser = exports.getPostById = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const message_1 = require("../utils/message");
const createPost = async (req, res, next) => {
    try {
        const { title, description, userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "userId is required", code: 400 });
        }
        const uploadedFiles = req.files ? req.files.map(file => file.path) : [];
        const post = await postModel_1.default.create({
            title,
            description,
            files: uploadedFiles,
            createdBy: userId,
        });
        return res.status(201).json({
            message: message_1.messages.createdSuccesfully,
            code: 201,
            post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await postModel_1.default.findById(postId).populate("createdBy", "userName email");
        if (!post) {
            return res.status(404).json({ message: message_1.messages.postNotFound, code: 404 });
        }
        return res.status(200).json({
            message: message_1.messages.postFetched,
            code: 200,
            post,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostById = getPostById;
const getPostsByUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const posts = await postModel_1.default.find({ createdBy: userId });
        return res.status(200).json({
            message: message_1.messages.userPostFetched,
            code: 200,
            posts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostsByUser = getPostsByUser;
const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { title, description } = req.body;
        const uploadedFiles = req.files ? req.files.map(file => file.path) : [];
        const updatedPost = await postModel_1.default.findByIdAndUpdate(postId, {
            $set: {
                title,
                description,
                ...(uploadedFiles.length > 0 && { files: uploadedFiles }),
            },
        }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: message_1.messages.postNotFound, code: 404 });
        }
        return res.status(200).json({
            message: message_1.messages.postUpdatedSuccessfully,
            code: 200,
            post: updatedPost,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const deletedPost = await postModel_1.default.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: message_1.messages.postNotFound, code: 404 });
        }
        return res.status(200).json({
            message: message_1.messages.postDeletedSuccessfully,
            code: 200,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postControllers.js.map