import Joi from "joi";

export const createPostValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    userId: Joi.string().required()
});


export const getPostByUserValidation = Joi.object({
         userId: Joi.string().required()
});

