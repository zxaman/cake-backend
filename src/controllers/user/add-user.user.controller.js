import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const addUser = asyncHandler(async (req, res) => {
  let existingUser = await User.findOne({ email: req.body.email });
  let employeeId = generateEmployeeId();
  if (existingUser) {
    throw new ApiError(400, "User already exists with given email");
  }
  req.body.employeeId = employeeId;
  const user = await new User(req.body);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User added successfully"));
});
export default addUser;
