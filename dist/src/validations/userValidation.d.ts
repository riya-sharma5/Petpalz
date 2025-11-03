import type { Request, Response, NextFunction } from "express";
import Joi from "joi";
import type { ObjectSchema } from "joi";
export declare const validateRequest: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateQuery: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateParams: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const signupValidation: Joi.ObjectSchema<any>;
export declare const sendOtpValidation: Joi.ObjectSchema<any>;
export declare const resendOtpValidation: Joi.ObjectSchema<any>;
export declare const checkEmailValidation: Joi.ObjectSchema<any>;
export declare const verifyOtpValidation: Joi.ObjectSchema<any>;
export declare const loginWithEmailValidation: Joi.ObjectSchema<any>;
export declare const loginWihMobileValidation: Joi.ObjectSchema<any>;
export declare const loginWithSocialValidation: Joi.ObjectSchema<any>;
export declare const listValidation: Joi.ObjectSchema<any>;
//# sourceMappingURL=userValidation.d.ts.map