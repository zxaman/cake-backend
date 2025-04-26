import { body } from "express-validator";
import { GenderEnum } from "../../constants.js";
import parsePhoneNumberFromString from "libphonenumber-js";

const updateCurrentUserValidator = () => {
  return [
    body("firstName")
      .optional()
      .trim()
      .isString()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName")
      .optional()
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Last name is required"),
    // body("email")
    //   .optional()
    //   .trim()
    //   .isString()
    //   .notEmpty()
    //   .withMessage("Email is required")
    //   .isEmail()
    //   .withMessage("Invalid email address"),
    body("dob")
      .optional()
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
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(Object.values(GenderEnum))
      .withMessage(
        `Gender must be one of: ${Object.values(GenderEnum).join(", ")}`,
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
    body("address")
      .optional()
      .isString()
      .withMessage("Address must be a string")
      .notEmpty()
      .withMessage("Address is required"),
  ];
};

export default updateCurrentUserValidator;
