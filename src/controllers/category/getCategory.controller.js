import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Category } from "../../models/category.model.js";

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
        throw new ApiError(404, "No categories found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export default getCategories;
