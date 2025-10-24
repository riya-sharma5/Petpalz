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
exports.likeUnlikeEntity = void 0;
const likesModel_1 = __importStar(require("../models/likesModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const message_1 = require("../utils/message");
const mongoose_1 = require("mongoose");
const likeUnlikeEntity = async (req, res, next) => {
    try {
        const { entityId, type, userId } = req.body;
        if (!Object.values(likesModel_1.likeType).includes(type)) {
            return next({
                code: 400,
                message: message_1.ERROR_RESPONSE.invalidEntityType,
            });
        }
        const entityObjectId = new mongoose_1.Types.ObjectId(entityId);
        if (type === likesModel_1.likeType.Post) {
            const postExists = await postModel_1.default.findById(entityObjectId);
            if (!postExists) {
                return next({
                    code: 404,
                    message: message_1.ERROR_RESPONSE.postNotFound,
                });
            }
        }
        else if (type === likesModel_1.likeType.Comment) {
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
            if (type === likesModel_1.likeType.Post) {
                await postModel_1.default.updateOne({ _id: entityObjectId, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } });
            }
            else if (type === likesModel_1.likeType.Comment) {
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
            if (type === likesModel_1.likeType.Post) {
                await postModel_1.default.updateOne({ _id: entityObjectId }, { $inc: { likeCount: 1 } });
            }
            else if (type === likesModel_1.likeType.Comment) {
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