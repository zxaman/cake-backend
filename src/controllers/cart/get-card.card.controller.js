import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const cart = await Cart.findOne({ userId: _id }).populate({
    path: "items.productId",
    model: Product,
    select: "name price image",
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export default getCart;
