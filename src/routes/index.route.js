import { Router } from "express";
import healthCheckRouter from "./healthcheck.route.js";
import userRouter from "./user/user.route.js";
import authRouter from "./auth/auth.route.js";
import productRoute from "./product/product.route.js"
import cartRoute from "./cart/cart.route.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import rateLimiter from "../middlewares/rate-limiter.middleware.js";
import orderRouter from "./order/order.route.js"
import getCategories from "../controllers/category/getCategory.controller.js";

const router = Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/product", productRoute)
router.use("/cart", verifyJWT, cartRoute)
router.use("/order", verifyJWT, orderRouter)
router.use("/categories", getCategories)

export default router;
