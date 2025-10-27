import Joi from "joi";

export const addPetValidation = Joi.object({
  petName: Joi.string().required(),
  species: Joi.string().required(),
  breed: Joi.string().required(),
  gender: Joi.string().required(),
  dateOfBirth: Joi.string().optional(),
  age: Joi.string().optional(),
  userId: Joi.string().required(),
});

export const updatePetValidation = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
  petName: Joi.string().optional(),
  species: Joi.string().optional(),
  breed: Joi.string().optional(),
  gender: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  age: Joi.string().optional(),
});

export const deletePetValidation = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required(),
});
