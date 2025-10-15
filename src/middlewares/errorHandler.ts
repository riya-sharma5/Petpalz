
import type {Request, Response, NextFunction} from 'express'

export interface ErrorType{
    code: number,
    message: string,
    data: NextFunction
}

export function errorHandler(err: ErrorType, req: Request, res: Response,  next: NextFunction) {
   
  console.error(err);
  res.status(500).json(err);
}

