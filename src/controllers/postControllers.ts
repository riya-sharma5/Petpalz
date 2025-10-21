import { Request, Response, NextFunction } from "express";
import postModel from "../models/postModel";
import {messages} from '../utils/message';
import mongoose from "mongoose";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required", code: 400 });
    }

    const uploadedFiles = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

    const post = await postModel.create({
      title,
      description,
      files: uploadedFiles,
      createdBy: userId,
    });

    return res.status(201).json({
      message: messages.createdSuccesfully,
      code: 201,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;

    const post = await postModel.findById(postId).populate("createdBy", "userName email");
    if (!post) {
      return res.status(404).json({ message: messages.postNotFound, code: 404 });
    }

    return res.status(200).json({
      message: messages.postFetched,
      code: 200,
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
     const posts = await postModel.find({ createdBy: userId });

    return res.status(200).json({
      message: messages.userPostFetched,
      code: 200,
      posts,
    });
  } catch (error) {
    next(error);
  }
};


export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    const uploadedFiles = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

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
      return res.status(404).json({ message: messages.postNotFound, code: 404 });
    }

    return res.status(200).json({
      message: messages.postUpdatedSuccessfully,
      code: 200,
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;

    const deletedPost = await postModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: messages.postNotFound, code: 404 });
    }

    return res.status(200).json({
      message: messages.postDeletedSuccessfully,
      code: 200,
    });
  } catch (error) {
    next(error);
  }
};
