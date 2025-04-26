import { Router } from "express";
import createOrder from "../../controllers/order/create.order.controller.js";
import updateOrder from "../../controllers/order/update.order.controller.js";
import getAllOrders from "../../controllers/order/get-all.order.controller.js";
import getOrderById from "../../controllers/order/getById.order.controller.js";

const router = Router();

router.post("/create", createOrder);

router.post("/update", updateOrder)

router.get("/all", getAllOrders)

router.get("/:id", getOrderById)

export default router;