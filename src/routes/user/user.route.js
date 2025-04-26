import { Router } from "express";
import { validate } from "../../validators/validator.js";
import { UserRolesEnum } from "../../constants.js";
import accessControl from "../../middlewares/access-control.middleware.js";
import { uploads } from "../../middlewares/multer.middleware.js";
import updateCurrentUserValidator from "../../validators/user/update-current-user.user.validator.js";
import updateUserValidator from "../../validators/user/update-user.user.validator.js";

import {
  addUser,
  addUsersInBulk,
  getCurrentUser,
  getAllUsers,
  changePassword,
  updateAvatar,
  updateCurrentUser,
  updateUser,
  getUserById,
} from "../../controllers/user/index.user.controller.js";
import {
  getAllUsersValidator,
  addUserValidator,
  changePasswordValidator,
  addUsersValidator,
} from "../../validators/user/index.user.validator.js";

const router = Router();

router.post(
  "/add",
  accessControl([UserRolesEnum.ADMIN, UserRolesEnum.APPLICATION_ADMIN]),
  addUserValidator(),
  validate,
  addUser,
);
router.post(
  "/addUsers",
  accessControl([UserRolesEnum.ADMIN, UserRolesEnum.APPLICATION_ADMIN]),
  addUsersValidator(),
  validate,
  addUsersInBulk,
);
router.get("/current-user", getCurrentUser);
router.post(
  "/getAll",
  accessControl([UserRolesEnum.ADMIN, UserRolesEnum.APPLICATION_ADMIN]),
  getAllUsersValidator(),
  validate,
  getAllUsers,
);

router.get(
  "/:userId",
  accessControl([UserRolesEnum.ADMIN, UserRolesEnum.APPLICATION_ADMIN]),
  getUserById,
);

router.patch("/", updateCurrentUserValidator(), validate, updateCurrentUser);

router.patch(
  "/change-password",
  changePasswordValidator(),
  validate,
  changePassword,
);

router.patch(
  "/update/:userId",
  accessControl([UserRolesEnum.ADMIN, UserRolesEnum.APPLICATION_ADMIN]),
  updateUserValidator(),
  validate,
  updateUser,
);

const avatarFilter = (req, file, cb) => {
  console.log("file", file);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

router.patch("/avatar", uploads(avatarFilter).single("avatar"), updateAvatar);

export default router;
