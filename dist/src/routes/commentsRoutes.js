"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsValidation_1 = require("../validations/commentsValidation");
const commentsController_1 = require("../controllers/commentsController");
const userValidation_1 = require("../validations/userValidation");
const router = express_1.default.Router();
router.post('/add-comment', (0, userValidation_1.validateRequest)(commentsValidation_1.addCommentValidation), commentsController_1.addComment);
router.put('/update-comment', (0, userValidation_1.validateRequest)(commentsValidation_1.updateCommentValidation), commentsController_1.updateComment);
router.delete('/delete-comment', (0, userValidation_1.validateRequest)(commentsValidation_1.deleteCommentValidation), commentsController_1.deleteComment);
router.get('/get-comments', (0, userValidation_1.validateRequest)(commentsValidation_1.getCommentValidation), commentsController_1.getCommentsByPost);
exports.default = router;
//# sourceMappingURL=commentsRoutes.js.map