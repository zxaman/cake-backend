import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const changePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  const user = await User.findById(_id);
  user.password = password;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export default changePassword;
