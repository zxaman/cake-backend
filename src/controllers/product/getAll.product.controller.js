import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const { type, sortByName, sortByPrice } = req.query;

  const filter = {};
  if (type) {
    filter.type = type;
  }

  let sort = {};

  if (sortByName === "asc") {
    sort.name = 1;
  } else if (sortByName === "desc") {
    sort.name = -1;
  }

  if (sortByPrice === "asc") {
    sort.price = 1;
  } else if (sortByPrice === "desc") {
    sort.price = -1;
  }

  const products = await Product.find(filter).sort(sort);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export default getAllProducts;
