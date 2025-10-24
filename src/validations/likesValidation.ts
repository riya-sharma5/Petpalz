import Joi from 'joi';

export const entityValidation = Joi.object({
    entityId : Joi.string().required(),
    userId: Joi.string().required(),
    type: Joi.string().required()
})