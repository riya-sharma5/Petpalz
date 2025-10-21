import express from "express";
import upload from "../middlewares/multer";
import {
  createPost,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
} from "../controllers/postControllers";
import {validateRequest} from '../middlewares/userValidation';
import {createPostValidation, getPostByUserValidation} from "../utils/postValidation"

const router = express.Router();

router.post("/create", upload.array("files"), validateRequest(createPostValidation), createPost);
router.get("/:postId", getPostById);
router.post("/by-id", validateRequest(getPostByUserValidation), getPostsByUser);
router.put("/:postId", upload.array("files"), updatePost);
router.delete("/:postId", deletePost);

export default router;
