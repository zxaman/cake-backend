import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { UserRolesEnum } from "../../constants.js";

const addUsersInBulk = asyncHandler(async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    throw new ApiError(400, "Users array is required and cannot be empty");
  }

  for (const user of users) {
    if (user.userRole === UserRolesEnum.ADMIN) {
      throw new ApiError(400, `You cannot add ${UserRolesEnum.ADMIN}`);
    }
    if (
      req.user.userRole === UserRolesEnum.APPLICATION_ADMIN &&
      user.userRole === UserRolesEnum.APPLICATION_ADMIN
    ) {
      throw new ApiError(
        400,
        "Application admin cannot add another application admin",
      );
    }
  }

  const emails = users.map((user) => user.email);

  const existingUsers = await User.find({
    email: { $in: emails },
  });
  if (existingUsers.length > 0) {
    const existingEmails = existingUsers.map((user) => user.email);
    throw new ApiError(
      400,
      `The following emails already exist: ${existingEmails.join(", ")}`,
    );
  }

  const bulkInsertData = users.map((user) => ({
    ...user,
    employeeId: generateEmployeeId(),
  }));

  await User.insertMany(bulkInsertData);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Users added successfully"));
});

export default addUsersInBulk;
