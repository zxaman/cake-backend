import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import path from "path";
import fs from "fs";

const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const avatar = req.file;
  let prevAvatarPath = null;
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.avatar) {
    prevAvatarPath = path.join(process.cwd(), user.avatar);
  }

  user.avatar = avatar.path;
  await user.save();

  if (prevAvatarPath) {
    fs.unlink(prevAvatarPath, (err) => {
      if (err) {
        console.error("Error deleting previous avatar:", err);
      } else {
        console.log("Previous avatar deleted successfully");
      }
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Avatar updated successfully"));
});

export default updateAvatar;
