import { body } from "express-validator";
import { UserRolesEnum, GenderEnum, UserStatusEnum } from "../../constants.js";
import parsePhoneNumberFromString from "libphonenumber-js";

const addUsersValidator = () => {
  return [
    body("users")
      .isArray()
      .withMessage("Users must be an array")
      .notEmpty()
      .withMessage("Users array is required")
      .custom((users) => {
        if (users.length === 0) {
          throw new Error("Users array cannot be empty");
        }
        users.forEach((user, index) => {
          if (
            !user.firstName ||
            typeof user.firstName !== "string" ||
            user.firstName.trim() === ""
          ) {
            throw new Error(
              `User at index ${index} must have a valid firstName`,
            );
          }
          if (
            !user.lastName ||
            typeof user.lastName !== "string" ||
            user.lastName.trim() === ""
          ) {
            throw new Error(
              `User at index ${index} must have a valid lastName`,
            );
          }
          if (
            !user.email ||
            typeof user.email !== "string" ||
            !/\S+@\S+\.\S+/.test(user.email)
          ) {
            throw new Error(`User at index ${index} must have a valid email`);
          }
          if (!user.dob || isNaN(new Date(user.dob))) {
            throw new Error(
              `User at index ${index} must have a valid date of birth in YYYY-MM-DD format`,
            );
          }
          if (new Date(user.dob) >= new Date()) {
            throw new Error(
              `User at index ${index} must have a date of birth in the past`,
            );
          }
          if (
            !user.gender ||
            !Object.values(GenderEnum).includes(user.gender)
          ) {
            throw new Error(
              `User at index ${index} must have a valid gender (${Object.values(GenderEnum).join(", ")})`,
            );
          }
          if (
            !user.address ||
            typeof user.address !== "string" ||
            user.address.trim() === ""
          ) {
            throw new Error(`User at index ${index} must have a valid address`);
          }
          if (
            !user.password ||
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              user.password,
            )
          ) {
            throw new Error(
              `User at index ${index} must have a strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)`,
            );
          }
          if (
            !user.mobileNo || // Check if the mobile number is missing
            typeof user.mobileNo !== "string" || // Ensure it's a string
            user.mobileNo.trim() === "" || // Ensure it's not empty
            !parsePhoneNumberFromString(user.mobileNo) || // Ensure it's parsable
            !parsePhoneNumberFromString(user.mobileNo).isValid() // Ensure it's valid
          ) {
            throw new Error(
              `User at index ${index} must have a valid mobile number`,
            );
          }
          if (
            user.userStatus &&
            !Object.values(UserStatusEnum).includes(user.userStatus)
          ) {
            throw new Error(
              `User at index ${index} must have a valid user status (${Object.values(UserStatusEnum).join(", ")})`,
            );
          }
          if (user.userRole) {
            if (!Object.values(UserRolesEnum).includes(user.userRole)) {
              throw new Error(
                `User at index ${index} must have a valid user role (${Object.values(UserRolesEnum).join(", ")})`,
              );
            }
          }
        });
        return true;
      }),
  ];
};

export default addUsersValidator;
