import Joi from "joi";

export const sendMessageValidation = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
  message: Joi.string().required().max(1000), 
  mediaURL : Joi.string().optional(),
  mediaType: Joi.string().optional()
});

export const getChatHistoryValidation = Joi.object({
  userId: Joi.string().required(),
  otherUserId: Joi.string().required(),
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(20),
});

export const markMessagesAsReadValidation = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
});

export const deleteMessageValidation = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
});
