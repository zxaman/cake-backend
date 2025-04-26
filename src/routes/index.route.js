import { Router } from "express";
import healthCheckRouter from "./healthcheck.route.js";
import userRouter from "./user/user.route.js";
import authRouter from "./auth/auth.route.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import rateLimiter from "../middlewares/rate-limiter.middleware.js";

const router = Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/user", verifyJWT, rateLimiter, userRouter);
router.use("/auth", authRouter);

export default router;
