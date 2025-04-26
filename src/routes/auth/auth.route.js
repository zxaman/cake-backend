import { Router } from "express";
import {
  login,
  forgotPasswordRequest,
  resetPassword,
} from "../../controllers/auth/index.auth.controller.js";
import { loginValidator } from "../../validators/auth/login.auth.validator.js";
import { validate } from "../../validators/validator.js";
import { forgotPasswordRequestValidator } from "../../validators/auth/forgot-password-request.auth.validator.js";
import { resetPasswordValidator } from "../../validators/auth/reset-password.auth.validator.js";

const router = Router();

router.post("/login", loginValidator(), validate, login);

router.post(
  "/forgot-password",
  forgotPasswordRequestValidator(),
  validate,
  forgotPasswordRequest,
);

router.post(
  "/reset-password/:resetToken",
  resetPasswordValidator(),
  validate,
  resetPassword,
);

export default router;
