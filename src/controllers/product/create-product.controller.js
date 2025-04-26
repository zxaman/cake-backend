import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, type, image } = req.body;

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw new ApiError(400, "Product already exists with the given name");
  }

  const product = new Product({ name, description, price, type, image });
  await product.save();

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export default createProduct;
