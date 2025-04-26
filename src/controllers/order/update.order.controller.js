import { Order } from "../../models/oder.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const updateOrder = asyncHandler(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        throw new ApiError(400, "Missing required parameters");
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    console.log("order", order)

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json(new ApiResponse(400, null, "Signature verification failed"));
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.status = "Paid";

    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Payment successfully verified and order updated"));
});

export default updateOrder;
