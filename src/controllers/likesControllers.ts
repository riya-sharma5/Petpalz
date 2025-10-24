import { Request, Response, NextFunction } from "express";
import likeModel, { likeType } from "../models/likesModel";
import postModel from "../models/postModel";
import commentModel from "../models/commentsModel";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";
import { Types } from "mongoose";

export const likeUnlikeEntity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { entityId, type, userId} = req.body;
 
    if (!Object.values(likeType).includes(type)) {
      return next({
        code: 400,
        message: ERROR_RESPONSE.invalidEntityType,
      });
    }

    const entityObjectId = new Types.ObjectId(entityId);

    if (type === likeType.Post) {
      const postExists = await postModel.findById(entityObjectId);
      if (!postExists) {
        return next({
          code: 404,
          message: ERROR_RESPONSE.postNotFound,
        });
      }
    } else if (type === likeType.Comment) {
      const commentExists = await commentModel.findById(entityObjectId);
      if (!commentExists) {
        return next({
          code: 404,
          message: ERROR_RESPONSE.commentNotFound,
        });
      }
    }

    const existingLike = await likeModel.findOne({
      userId,
      entityId: entityObjectId,
      type,
    });

    if (existingLike) {
      await existingLike.deleteOne();

      if (type === likeType.Post) {
        await postModel.updateOne(
          { _id: entityObjectId, likeCount: { $gt: 0 } },
          { $inc: { likeCount: -1 } }
        );
      } else if (type === likeType.Comment) {
        await commentModel.updateOne(
          { _id: entityObjectId, likeCount: { $gt: 0 } },
          { $inc: { likeCount: -1 } }
        );
      }

      return res.status(200).json({
        code: 200,
        message: SUCCESS_RESPONSE.unlikeSuccessful,
        data: { entityId, liked: false },
      });
    } else {
      const newLike = new likeModel({ userId, entityId: entityObjectId, type });
      await newLike.save();

      if (type === likeType.Post) {
        await postModel.updateOne(
          { _id: entityObjectId },
          { $inc: { likeCount: 1 } }
        );
      } else if (type === likeType.Comment) {
        await commentModel.updateOne(
          { _id: entityObjectId },
          { $inc: { likeCount: 1 } }
        );
      }

      return res.status(201).json({
        code: 201,
        message: SUCCESS_RESPONSE.likeSuccessful,
        data: { entityId, liked: true },
      });
    }
  } catch (error) {
    next(error);
  }
};
