import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ObjectId } from "mongodb";
import { UserRolesEnum } from "../../constants.js";

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.body.dob) {
    req.body.dob = new Date(req.body.dob);
  }

  if (req.body.userRole) {
    if (req.body.userRole === UserRolesEnum.APPLICATION_ADMIN) {
      let assignedLeads = await AssignedLead.find({
        userId: new ObjectId(userId),
        status: { $ne: LeadStatusEnum.CLOSED },
      });
      console.log("assignedLeads", assignedLeads);
      if (assignedLeads.length > 0) {
        throw new ApiError(
          400,
          "User has assigned leads, cannot update user role",
        );
      }
    }
  }

  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    console.log("user", user);
    if (user && user._id.toString() !== userId) {
      throw new ApiError(400, "Email already exists");
    }
  }

  let updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "User updated successfully"));
});

export default updateUser;
