import { Router } from "express";
import { validate } from "../../validators/validator.js";
import { UserRolesEnum } from "../../constants.js";
import accessControl from "../../middlewares/access-control.middleware.js";
import { uploads } from "../../middlewares/multer.middleware.js";
import updateCurrentUserValidator from "../../validators/user/update-current-user.user.validator.js";

import {
  addUser,
  getCurrentUser,
  changePassword,
  updateAvatar,
  updateCurrentUser,
  getUserById,
} from "../../controllers/user/index.user.controller.js";
import {
  getAllUsersValidator,
  addUserValidator,
  changePasswordValidator
} from "../../validators/user/index.user.validator.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/add",
  addUserValidator(),
  validate,
  addUser,
);

router.get("/current-user", verifyJWT, getCurrentUser);

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
