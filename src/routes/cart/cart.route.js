import { Router } from "express";
import addToCart from "../../controllers/cart/add-to-cart.controller.js";
import { validate } from "../../validators/validator.js";
import addToCartValidator from "../../validators/cart/addToCartValidator.js";
import removeProductFromCart from "../../controllers/cart/remove-from-cart.controller.js";
import removeProductFromCartValidator from "../../validators/cart/remove-from-cart.validator.js";
import getCart from "../../controllers/cart/get-card.card.controller.js";

const router = Router();

router.post("/add", addToCartValidator(), validate, addToCart);

router.delete(
    "/remove",
    removeProductFromCartValidator(),
    validate,
    removeProductFromCart
);

router.get("/", getCart)

export default router;
