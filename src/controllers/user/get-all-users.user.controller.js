import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { constructAggregateFilter } from "../../helpers/construct-aggregate-filter.helper.js";
import { getMongoosePaginationOptions } from "../../helpers/get-mongoose-pagination-option.helper.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const {
    search,
    filter,
    pagination: { page, limit },
    sort,
  } = req.body;

  const searchRegex = new RegExp(search, "i");
  const sortField = sort ?? { _id: 1 };

  // let appAdmin =
  //   req.user.userRole === UserRolesEnum.APPLICATION_ADMIN ||
  //   req.user.userRole === UserRolesEnum.ADMIN
  //     ? { userRole: UserRolesEnum.USER }
  //     : {};

  const usersAggregate = User.aggregate([
    {
      $match: {
        _id: { $ne: req.user._id },
        // ...appAdmin,
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { mobileNo: searchRegex },
          { address: searchRegex },
        ],
        ...constructAggregateFilter(filter),
      },
    },
    { $sort: sortField },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        mobileNo: 1,
        dob: 1,
        gender: 1,
        address: 1,
        userRole: 1,
      },
    },
  ]);

  let users = await User.aggregatePaginate(
    usersAggregate,
    getMongoosePaginationOptions({ page, limit }),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, users, "User fetched successfully"));
});

export default getAllUsers;
