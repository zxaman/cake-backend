import express from "express";
import cors from "cors";
import { createServer } from "http";
import mainRouter from "./routes/index.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import { winstonStream } from "./utils/logger.js";
import logger from "./utils/logger.js";

const app = express();
const httpServer = createServer(app);

const API_PREF = process.env.API_PREF || "";

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*"
        : process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(`${API_PREF}/public`, express.static("public"));

morgan.token("userId", (req) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return decodedToken?._id || "";
    } catch {
      return "";
    }
  }
  return "";
});

morgan.token("reqPayload", (req) =>
  req.body ? JSON.stringify(req.body) : "{}",
);

app.use(
  morgan(":method|:url|:userId|:reqPayload", {
    immediate: true,
    stream: winstonStream,
  }),
);

app.use((req, res, next) => {
  const startTime = Date.now();
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;
    logger.info(
      `[Outgoing] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ${data.message || "Success"}\n`,
    );
    return originalJson.call(this, data);
  };
  next();
});

app.use(API_PREF, mainRouter);

app.use(errorHandler);

export { httpServer };
