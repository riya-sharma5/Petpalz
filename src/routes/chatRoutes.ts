import express from "express";
import { deleteMessageValidation, getChatHistoryValidation, sendMessageValidation, markMessagesAsReadValidation} from "../validations/chatValidation";
import { validateRequest, validateParams } from "../validations/userValidation";
import {
  sendMessage,
  getChatHistory,
  markMessagesAsRead,
  deleteMessage,
} from "../controllers/chatController";

const router = express.Router();

router.post("/send", validateRequest(sendMessageValidation), sendMessage);
router.get("/:userId/:otherUserId", validateParams(getChatHistoryValidation), getChatHistory);
router.patch("/read", validateRequest(markMessagesAsReadValidation), markMessagesAsRead);
router.delete("/delete", validateRequest(deleteMessageValidation), deleteMessage);

export default router;
