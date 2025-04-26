import { Router } from "express";
import {
  login,
} from "../../controllers/auth/index.auth.controller.js";
import { loginValidator } from "../../validators/auth/login.auth.validator.js";
import { validate } from "../../validators/validator.js";

const router = Router();

router.post("/login", loginValidator(), validate, login);

export default router;
