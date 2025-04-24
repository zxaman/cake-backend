const User = require("../../models/admin-auth.model");
const jwtConfig = require("../../config/jwt");

exports.register = async (req, res, next) => {
  try {
    // Form data will be available in req.body the same way
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = jwtConfig.generateToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};