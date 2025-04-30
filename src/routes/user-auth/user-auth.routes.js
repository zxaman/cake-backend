const express = require('express');
const router = express.Router();
const { registerUser } = require('../../controllers/user-auth/register.user-auth.controller');
const { login } = require('../../controllers/user-auth/login.user-auth.controller');
const { getMe } = require('../../controllers/user-auth/get-me.user-auth.controller');
const protect = require('../../middleware/auth');

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', getMe);

module.exports = router;