const express = require("express");
const { register } = require("../../controllers/admin-auth/post-register.admin-auth.controller");
const { login } = require("../../controllers/admin-auth/login.admin-auth.controller");
const { protect } = require("../../controllers/admin-auth/protect.admin-auth.controller");
const { getMe } = require("../../controllers/admin-auth/get-me.admin-auth.controller");

const router = express.Router();

// Changed from /admin to /user in app.js
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;