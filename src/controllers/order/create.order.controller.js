import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";
import { Order } from "../../models/oder.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const { _id: userId, email } = req.user;
  const { name, address, city, state, zipcode, country, cartId } = req.body;

  if (!name || !address || !city || !state || !zipcode || !country || !cartId) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("1")

  const cart = await Cart.findById(cartId).populate("items.productId");
  console.log("2", cart)
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  let totalAmount = 0;
  cart.items.forEach((item) => {
    totalAmount += item.productId.price * item.quantity;
  });

  console.log("3", totalAmount)

  if (totalAmount <= 0) {
    throw new ApiError(400, "Cart total amount must be greater than zero");
  }

  const options = {
    amount: totalAmount * 100, // in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  const order = await Order.create({
    userId,
    cartId,
    name,
    email,
    address,
    city,
    state,
    zipcode,
    country,
    amount: options.amount,
    razorpayOrderId: razorpayOrder.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export default createOrder;
