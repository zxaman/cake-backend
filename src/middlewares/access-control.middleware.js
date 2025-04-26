import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const accessControl = (requiredRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not logged in");
    }

    const hasAccess = requiredRoles.includes(user.userRole);

    if (!hasAccess) {
      console.log("Required Roles:", requiredRoles);
      throw new ApiError(403, "Forbidden: Access denied");
    }

    next();
  });
};

export default accessControl;
