import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAuthToken } from "../../helpers/generate-auth-token.helper.js";
import { ApiError } from "../../utils/ApiError.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }
  const token = await generateAuthToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "fullName email userRole",
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: loggedInUser, token }, "Login successful"),
    );
});

export default login;
