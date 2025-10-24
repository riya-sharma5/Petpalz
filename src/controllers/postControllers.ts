import { Request, Response, NextFunction } from "express";
import postModel from "../models/postModel";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, userId } = req.body;

    const uploadedFiles = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    const post = await postModel.create({
      title,
      description,
      files: uploadedFiles,
      userId: userId,
    });

    return res.status(201).json({
      message: SUCCESS_RESPONSE.createdSuccessfully,
      code: 201,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;

    const post = await postModel
      .findById(postId)
      .populate("userId", "userName email");
    if (!post) {
      return res
        .status(404)
        .json({ message: ERROR_RESPONSE.postNotFound, code: 404 });
    }

    return res.status(200).json({
      message: SUCCESS_RESPONSE.postFetched,
      code: 200,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const posts = await postModel.find({ userId: userId });

    return res.status(200).json({
      message: SUCCESS_RESPONSE.userPostFetched,
      code: 200,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    const uploadedFiles = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          title,
          description,
          ...(uploadedFiles.length > 0 && { files: uploadedFiles }),
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: ERROR_RESPONSE.postNotFound, code: 404 });
    }

    return res.status(200).json({
      message: SUCCESS_RESPONSE.postUpdatedSuccessfully,
      code: 200,
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;

    const deletedPost = await postModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: ERROR_RESPONSE.postNotFound, code: 404 });
    }

    return res.status(200).json({
      message: SUCCESS_RESPONSE.postDeletedSuccessfully,
      code: 200,
    });
  } catch (error) {
    next(error);
  }
};
