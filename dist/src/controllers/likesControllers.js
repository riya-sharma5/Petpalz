"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeUnlikeEntity = void 0;
const likesModel_1 = __importDefault(require("../models/likesModel"));
const enum_1 = require("../utils/enum");
const postModel_1 = __importDefault(require("../models/postModel"));
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const message_1 = require("../utils/message");
const mongoose_1 = require("mongoose");
const likeUnlikeEntity = async (req, res, next) => {
    try {
        const { entityId, type, userId } = req.body;
        if (!Object.values(enum_1.likeType).includes(type)) {
            return next({
                code: 400,
                message: message_1.ERROR_RESPONSE.invalidEntityType,
            });
        }
        const entityObjectId = new mongoose_1.Types.ObjectId(entityId);
        if (type === enum_1.likeType.Post) {
            const postExists = await postModel_1.default.findById(entityObjectId);
            if (!postExists) {
                return next({
                    code: 404,
                    message: message_1.ERROR_RESPONSE.postNotFound,
                });
            }
        }
        else if (type === enum_1.likeType.Comment) {
            const commentExists = await commentsModel_1.default.findById(entityObjectId);
            if (!commentExists) {
                return next({
                    code: 404,
                    message: message_1.ERROR_RESPONSE.commentNotFound,
                });
            }
        }
        const existingLike = await likesModel_1.default.findOne({
            userId,
            entityId: entityObjectId,
            type,
        });
        if (existingLike) {
            await existingLike.deleteOne();
            if (type === enum_1.likeType.Post) {
                await postModel_1.default.updateOne({ _id: entityObjectId, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } });
            }
            else if (type === enum_1.likeType.Comment) {
                await commentsModel_1.default.updateOne({ _id: entityObjectId, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } });
            }
            return res.status(200).json({
                code: 200,
                message: message_1.SUCCESS_RESPONSE.unlikeSuccessful,
                data: { entityId, liked: false },
            });
        }
        else {
            const newLike = new likesModel_1.default({ userId, entityId: entityObjectId, type });
            await newLike.save();
            if (type === enum_1.likeType.Post) {
                await postModel_1.default.updateOne({ _id: entityObjectId }, { $inc: { likeCount: 1 } });
            }
            else if (type === enum_1.likeType.Comment) {
                await commentsModel_1.default.updateOne({ _id: entityObjectId }, { $inc: { likeCount: 1 } });
            }
            return res.status(201).json({
                code: 201,
                message: message_1.SUCCESS_RESPONSE.likeSuccessful,
                data: { entityId, liked: true },
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.likeUnlikeEntity = likeUnlikeEntity;
//# sourceMappingURL=likesControllers.js.map