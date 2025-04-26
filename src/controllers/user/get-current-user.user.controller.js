import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  let userId = req.user._id;

  const user = await User.findById(userId).select(
    "-password -_id -__v -updatedAt",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data fetched successfully"));
});

export default getCurrentUser;
