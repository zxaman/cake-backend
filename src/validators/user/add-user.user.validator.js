import { body } from "express-validator";
import { UserRolesEnum, GenderEnum, UserStatusEnum } from "../../constants.js";
import parsePhoneNumberFromString from "libphonenumber-js";

const addUserValidator = () => {
  return [
    body("firstName")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Last name is required"),
    body("email")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("dob")
      .trim()
      .notEmpty()
      .withMessage("Date of birth is required")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Date of birth must be in YYYY-MM-DD format")
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        if (date >= today) {
          throw new Error("Date of birth must be in the past");
        }
        return true;
      }),
    body("gender")
      .isString()
      .notEmpty()
      .withMessage("gender is required")
      .isIn(Object.values(GenderEnum))
      .withMessage(
        `gender must be one of: ${Object.values(GenderEnum).join(", ")}`,
      ),
    body("address")
      .isString()
      .withMessage("Address must be a string")
      .notEmpty()
      .withMessage("Address is required"),
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
    body("mobileNo")
      .notEmpty()
      .withMessage("Mobile no. is required")
      .custom((value) => {
        if (typeof value !== "string") {
          throw new Error("Invalid mobile no.");
        }
        const phoneNumber = parsePhoneNumberFromString(value);
        if (!phoneNumber || !phoneNumber.isValid()) {
          throw new Error("Invalid mobile no.");
        }
        return true;
      }),
    body("userStatus")
      .optional()
      .trim()
      .isString()
      .withMessage("User status must be a string")
      .isIn(Object.values(UserStatusEnum))
      .withMessage(
        `User status must be one of: ${Object.values(UserStatusEnum).join(", ")}`,
      ),
    body("userRole")
      .optional()
      .trim()
      .isString()
      .notEmpty()
      .withMessage("User role is required")
      .isIn([UserRolesEnum.APPLICATION_ADMIN, UserRolesEnum.USER])
      .withMessage(
        `user role must be one of: ${UserRolesEnum.APPLICATION_ADMIN}, ${UserRolesEnum.USER}`,
      )
      .custom((value, { req }) => {
        const userRole = req.user.userRole;

        if (
          userRole === UserRolesEnum.APPLICATION_ADMIN &&
          value === UserRolesEnum.APPLICATION_ADMIN
        ) {
          throw new Error(
            "Application admin cannot add another application admin",
          );
        }
        return true;
      }),
  ];
};

export default addUserValidator;
