import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const generateAuthToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log("user", user);
    const accessToken = user.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token",
      error,
    );
  }
};
