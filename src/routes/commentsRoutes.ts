import express from "express";
import { addCommentValidation, deleteCommentValidation, updateCommentValidation } from "../validations/commentsValidation";
import {
  addComment,
  updateComment,
  deleteComment,
  getCommentsByPost,
  
} from "../controllers/commentsController";

import {validateRequest} from '../validations/userValidation';


const router = express.Router();

router.post('/add-comment', validateRequest(addCommentValidation), addComment);
router.put('/update-comment', validateRequest(updateCommentValidation), updateComment);
router.delete('/delete-comment', validateRequest(deleteCommentValidation), deleteComment);
router.get('/:id', getCommentsByPost); 

export default router;
