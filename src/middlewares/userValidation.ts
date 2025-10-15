import  type { Request, Response, NextFunction } from "express";
import Joi from "joi";
import type { ObjectSchema } from "joi";

export const validateRequest = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
    
      let result = await schema.validateAsync(req.body);
      req.body = result;
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: error.details[0]?.message,
      });
    }
  };
};

export const validateQuery = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
     
      let result = await schema.validateAsync(req.query);
        req.query = result;
        next();
    } catch (error: any) {
      return res.status(400).json({
        error: error?.details ? error?.details[0]?.message : "something went wrong",
      });
    }
  };
};

export const validateParams = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
     
      let result = await schema.validateAsync(req.params);
        req.params = result;
        next();
    } catch (error: any) {
      return res.status(400).json({
        error: error?.details ? error?.details[0]?.message : "something went wrong",
      });
    }
  };
};


export const signupValidation = Joi.object({
userName : Joi.string().required(),
 fullName : Joi.string().optional(),
  email: Joi.string().required(),
   mobileNumber : Joi.string().optional(),
    DOB : Joi.string().optional(),
    password : Joi.string().required(), 
    confirmPassword: Joi.string().required()
});


export const sendOtpValidation = Joi.object({

});

export const resendOtpValidation = Joi.object({

});

export const verifyOtpValidation = Joi.object({

});

export const loginValidation = Joi.object({
 identifier: Joi.string().required(),
 password: Joi.string().required()
});