"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const postControllers_1 = require("../controllers/postControllers");
const userValidation_1 = require("../middlewares/userValidation");
const postValidation_1 = require("../utils/postValidation");
const router = express_1.default.Router();
router.post("/create", multer_1.default.array("files"), (0, userValidation_1.validateRequest)(postValidation_1.createPostValidation), postControllers_1.createPost);
router.get("/:postId", postControllers_1.getPostById);
router.post("/by-id", (0, userValidation_1.validateRequest)(postValidation_1.getPostByUserValidation), postControllers_1.getPostsByUser);
router.put("/:postId", multer_1.default.array("files"), postControllers_1.updatePost);
router.delete("/:postId", postControllers_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map