import Joi from "joi";

export const addCommentValidation = Joi.object({
  text: Joi.string().required(),
  userId: Joi.string().required(),
  postId: Joi.string().required(),
  parentCommentId: Joi.string().optional(),
});

export const updateCommentValidation = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().required(),
  userId: Joi.string().required(),
});

export const deleteCommentValidation = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
});

export const getCommentValidation = Joi.object({
  postId: Joi.string().required(),
});
