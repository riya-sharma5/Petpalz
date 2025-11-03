"use strict";
// import express from "express";
// import { Application } from "express";
// import * as dotenv from "dotenv";
// import routev1 from "./routes/routev1";
// import { Server } from "http";
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// export class App {
//   public app: Application;
//   public port: string | number;
//   public base_url: string;
//   public server?: Server;
//   constructor(port: string | number, base_url: string) {
//     this.app = express();
//     this.port = port;
//     this.base_url = base_url;
//   }
//  public async initialize(): Promise<void> {
//      try {
//     this.initializeMiddlewares();
//     this.initializeRoutes();
//     this.server = this.app.listen(this.port, () => {
//       console.log(` Server is running on ${this.base_url}${this.port}`);
//     });
//     process.on('SIGINT', () => {
//       if (this.server) {
//         this.server.close(() => {
//           console.log('Server closed gracefully');
//           process.exit(0);
//         });
//       } else {
//         process.exit(0);
//       }
//     });
//     } catch (error) {
//       console.log("Server Connection error:", error);
//       process.exit();
//     }
//   }
//   private initializeMiddlewares(): void {
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: true }));
//     this.app.use("/uploads", express.static("uploads"));
//   }
//   private initializeRoutes(): void {
//     this.app.use("/api/v1", routev1);
//   }
// }
const express_1 = __importDefault(require("express"));
const routev1_1 = __importDefault(require("./routes/routev1"));
class App {
    app;
    port;
    base_url;
    constructor(port, base_url) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.base_url = base_url;
    }
    async initialize() {
        try {
            this.initializeMiddlewares();
            this.initializeRoutes();
            // console.log("Express app initialized");
        }
        catch (error) {
            console.log("Server Initialization error:", error);
            // process.exit(1);
        }
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use("/uploads", express_1.default.static("uploads"));
    }
    initializeRoutes() {
        this.app.use("/api/v1", routev1_1.default);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map