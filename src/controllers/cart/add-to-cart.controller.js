import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const { _id } = req.user;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  let cart = await Cart.findOne({ userId: _id });

  if (cart) {
    const existingProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex >= 0) {
      cart.items[existingProductIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
  } else {
    cart = new Cart({
      userId: _id,
      items: [{ productId, quantity }],
    });

    await cart.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart successfully"));
});

export default addToCart;
