// import express from "express";
// import * as dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import { App } from "./src/app";
// import { connectDB } from "./src/databases/database";
// import { setupSocketIO } from "./src/middlewares/webSocket"; 

// dotenv.config();

// const port = process.env.PORT || 8001;
// const base_url = process.env.BASE_URL || "";

// const myApp = new App(port, base_url);

//  const app = express();
//  const server = http.createServer(app);

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));


// connectDB
//   .then(() => {
//     console.log("MongoDB connected");
//     myApp.initialize();


//    setupSocketIO(server);

//    })
//   .catch((error) => {
//     console.error("Server connection error:", error);
//     process.exit();
//   });

import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { App } from "./src/app";
import { connectDB } from "./src/databases/database";
import { setupSocketIO } from "./src/middlewares/webSocket";

dotenv.config();

const port = Number(process.env.PORT) || 8001;
const base_url = process.env.BASE_URL || "";

const myApp = new App(port, base_url);
const app = myApp.app;
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

connectDB()
  .then(async () => {
    await myApp.initialize();

    setupSocketIO(server);

    server.listen(port, "192.168.1.10", () => {
      console.log(`Server running at http://192.168.1.10:${port}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });
