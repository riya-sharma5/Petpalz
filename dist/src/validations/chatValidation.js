"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageValidation = exports.markMessagesAsReadValidation = exports.getChatHistoryValidation = exports.sendMessageValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.sendMessageValidation = joi_1.default.object({
    senderId: joi_1.default.string().required(),
    receiverId: joi_1.default.string().required(),
    message: joi_1.default.string().required().max(1000),
    mediaURL: joi_1.default.string().optional(),
    mediaType: joi_1.default.string().optional()
});
exports.getChatHistoryValidation = joi_1.default.object({
    userId: joi_1.default.string().required(),
    otherUserId: joi_1.default.string().required(),
    page: joi_1.default.number().optional().default(1),
    limit: joi_1.default.number().optional().default(20),
});
exports.markMessagesAsReadValidation = joi_1.default.object({
    senderId: joi_1.default.string().required(),
    receiverId: joi_1.default.string().required(),
});
exports.deleteMessageValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
});
//# sourceMappingURL=chatValidation.js.map