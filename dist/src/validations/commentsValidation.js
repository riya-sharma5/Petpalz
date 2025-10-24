"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentValidation = exports.deleteCommentValidation = exports.updateCommentValidation = exports.addCommentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addCommentValidation = joi_1.default.object({
    text: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    postId: joi_1.default.string().required(),
    parentCommentId: joi_1.default.string().optional(),
});
exports.updateCommentValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
    text: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
});
exports.deleteCommentValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
});
exports.getCommentValidation = joi_1.default.object({
    postId: joi_1.default.string().required(),
});
//# sourceMappingURL=commentsValidation.js.map