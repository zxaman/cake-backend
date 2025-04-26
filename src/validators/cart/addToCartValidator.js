import { body } from "express-validator";

const addToCartValidator = () => {
  return [
    body("productId")
      .isMongoId()
      .withMessage("Invalid product ID format")
      .notEmpty()
      .withMessage("Product ID is required"),
    body("quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer")
      .notEmpty()
      .withMessage("Quantity is required"),
  ];
};

export default addToCartValidator;
