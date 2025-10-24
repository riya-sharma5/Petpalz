import { Router } from "express";
import userRoute from "./userRoutes";
import postRoute from "./postRoutes";
import likesRoute from "./likesRoutes";
import commentsRoute from "./commentsRoutes";

const router = Router();

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/likes", likesRoute);
router.use("/comments", commentsRoute);

export default router;
