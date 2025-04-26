import { body } from "express-validator";

const removeProductFromCartValidator = () => {
  return [
    body("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .isMongoId()
      .withMessage("Invalid Product ID")
  ];
};

export default removeProductFromCartValidator;
