"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatValidation_1 = require("../validations/chatValidation");
const userValidation_1 = require("../validations/userValidation");
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post("/send", (0, userValidation_1.validateRequest)(chatValidation_1.sendMessageValidation), chatController_1.sendMessage);
router.get("/:userId/:otherUserId", (0, userValidation_1.validateParams)(chatValidation_1.getChatHistoryValidation), chatController_1.getChatHistory);
router.patch("/read", (0, userValidation_1.validateRequest)(chatValidation_1.markMessagesAsReadValidation), chatController_1.markMessagesAsRead);
router.delete("/delete", (0, userValidation_1.validateRequest)(chatValidation_1.deleteMessageValidation), chatController_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map