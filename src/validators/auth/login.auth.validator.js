import { body } from "express-validator";

const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is not valid "),
    body("password").trim().notEmpty().withMessage("Password is required."),
  ];
};

export { loginValidator };
