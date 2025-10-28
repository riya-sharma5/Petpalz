import { Request, Response, NextFunction } from "express";
export declare const sendMessage: (req: Request, res?: Response, next?: NextFunction) => Promise<Response<any, Record<string, any>> | (import("mongoose").Document<unknown, {}, import("../models/chatModel").IChat, {}, {}> & import("../models/chatModel").IChat & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | undefined>;
export declare const getChatHistory: (req: Request, res?: Response, next?: NextFunction) => Promise<Response<any, Record<string, any>> | (import("mongoose").FlattenMaps<import("../models/chatModel").IChat> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[] | undefined>;
export declare const markMessagesAsRead: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMessage: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=chatController.d.ts.map