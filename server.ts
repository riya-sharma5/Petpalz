import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { App } from "./src/app";
import { connectDB } from "./src/databases/database";

dotenv.config();
const port = process.env.PORT || 9092;
const base_url = process.env.BASE_URL || "";

const myApp = new App(port, base_url);

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

connectDB
  .then(() => {
    console.log("MongoDB connected");
    myApp.initialize();
  })
  .catch((error) => {
    console.error("Server connection error:", error);
    process.exit();
  });
