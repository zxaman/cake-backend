import { Order } from "../../models/oder.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const getAllOrders = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let filter = {};

  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  const orders = await Order.find(filter)
    // .populate("userId", "name email")
    // .populate("cartId")
    .sort({ createdAt: -1 });

  if (!orders.length) {
    throw new ApiError(404, "No orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export default getAllOrders;
