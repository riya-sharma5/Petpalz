import { Application } from "express";
export declare class App {
    app: Application;
    port: string | number;
    base_url: string;
    constructor(port: string | number, base_url: string);
    initialize(): Promise<void>;
    private initializeMiddlewares;
    private initializeRoutes;
}
//# sourceMappingURL=app.d.ts.map