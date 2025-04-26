import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck/healthcheck.controller.js";

const router = Router();

router.get("/", healthcheck);

export default router;
