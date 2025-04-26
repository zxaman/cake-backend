import { body } from "express-validator";

const changePasswordValidator = () => {
  return [
    body("password")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  ];
};
export default changePasswordValidator;
