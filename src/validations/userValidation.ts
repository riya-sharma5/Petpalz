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
    dateOfBirth : Joi.string().optional(),
    password : Joi.string().required(), 
    confirmPassword: Joi.string().required()
});


export const sendOtpValidation = Joi.object({
   email: Joi.string().required()
});

export const resendOtpValidation = Joi.object({
     email: Joi.string().required()
});

export const checkEmailValidation = Joi.object({
    email: Joi.string().required()
});

export const verifyOtpValidation = Joi.object({
  email: Joi.string().required(),
  OTP: Joi.string().required()
});

export const loginWithEmailValidation = Joi.object({
 email: Joi.string().required(),
 password: Joi.string().required(),
 loginType: Joi.string().required()
});

export const loginWihMobileValidation = Joi.object({
 mobileNumber: Joi.string().required(),
 loginType: Joi.string().required()
});

export const loginWithSocialValidation = Joi.object({
  loginType: Joi.string().required(),
  email: Joi.string().required(),
 socialId: Joi.string().required()
})
