import express from "express";
import { entityValidation } from "../validations/likesValidation";
import { likeUnlikeEntity } from "../controllers/likesControllers";
import { validateRequest } from "../validations/userValidation";

const router = express.Router();

router.post("/like-unlike", validateRequest(entityValidation), likeUnlikeEntity);

export default router;
