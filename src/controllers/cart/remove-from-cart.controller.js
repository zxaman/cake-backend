import { Cart } from "../../models/cart.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const cart = await Cart.findOne({ userId: _id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const productIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  const product = cart.items[productIndex];

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart.items.splice(productIndex, 1);
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product updated in cart successfully"));
});

export default removeProductFromCart;
