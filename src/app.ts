import express from "express";
import { Application } from "express";
import * as dotenv from "dotenv";
import routev1 from "./routes/routev1";
dotenv.config();

export class App {
  public app: Application;
  public port: string | number;
  public base_url: string;

  constructor(port: string | number, base_url: string) {
    this.app = express();
    this.port = port;
    this.base_url = base_url;
  }

  public async initialize(): Promise<void> {
    try {
      this.app.listen(this.port, () => {
        console.log(` Server is running on ${this.base_url}${this.port}`);
      });
    } catch (error) {
      console.log("Server Connection error:", error);
      process.exit();
    }

    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/uploads", express.static("uploads"));
  }

  private initializeRoutes(): void {
     this.app.use("/api/v1", routev1);

  }
}

