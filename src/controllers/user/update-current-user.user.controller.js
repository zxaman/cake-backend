import { UserRolesEnum } from "../../constants.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const updateData = { ...req.body }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    fields: "-password -_id -__v -updatedAt",
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export default updateCurrentUser;
