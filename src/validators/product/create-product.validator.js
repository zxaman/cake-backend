import { body } from "express-validator";

const createProductValidator = () => {
  return [
    body("name")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Product name is required"),

    body("description")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Product description is required"),

    body("price")
      .trim()
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a numeric value"),

    body("type")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Product type is required"),

    body("image")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("Product image URL is required")
    //   .isURL()
    //   .withMessage("Image must be a valid URL"),
  ];
};

export default createProductValidator;
