import { Request, Response, NextFunction } from "express";
import commentModel from "../models/commentsModel";
import postModel from "../models/postModel";
import dotenv from "dotenv";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";

dotenv.config();

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId, text, parentCommentId, userId } = req.body;

    const postExists = await postModel.findById(postId);
    if (!postExists) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.postNotFound });
    }

    const comment = await commentModel.create({
      postId,
      userId,
      text,
      parentCommentId: parentCommentId || null,
    });

    await postModel.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });

    return res.status(201).json({
      code: 201,
      message: SUCCESS_RESPONSE.commentAdded,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, text, userId } = req.body;

    const comment = await commentModel.findById(id);
    if (!comment) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.commentNotFound });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ code: 403, message: ERROR_RESPONSE.unauthorizedAction });
    }

    const hoursPassed =
      (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursPassed > 24) {
      return res.status(403).json({
        code: 403,
        message: ERROR_RESPONSE.cannotEditAfter24h,
      });
    }

    comment.text = text;
    comment.updatedAt = new Date();
    await comment.save();

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.commentUpdated,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.body;

    const comment = await commentModel.findById(id);
    if (!comment) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.commentNotFound });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ code: 403, message: ERROR_RESPONSE.unauthorizedAction });
    }

    await comment.deleteOne();

    await postModel.updateOne(
      { _id: comment.get("postId"), commentCount: { $gt: 0 } },
      { $inc: { commentCount: -1 } }
    );

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.commentDeleted,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalComments = await commentModel.countDocuments({ postId });
    const comments = await commentModel
      .find({ postId })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.commentsFetched,
      data: {
        comments,
        pagination: {
          totalComments,
          currentPage: page,
          totalPages: Math.ceil(totalComments / limit),
          pageSize: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
