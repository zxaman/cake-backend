import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateAuthToken } from "../../helpers/generate-auth-token.helper.js";

const addUser = asyncHandler(async (req, res) => {
  let existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with given email");
  }
  const user = await new User(req.body);
  await user.save();


  const token = await generateAuthToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "fullName email userRole",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user: loggedInUser, token }, "Account created successfully"));
});
export default addUser;
