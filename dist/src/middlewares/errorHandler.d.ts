import type { Request, Response, NextFunction } from 'express';
export interface ErrorType {
    code: number;
    message: string;
    data: NextFunction;
}
export declare function errorHandler(err: ErrorType, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map