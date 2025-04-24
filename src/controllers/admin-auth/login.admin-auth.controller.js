const User = require('../../models/admin-auth.model');
const jwtConfig = require('../../config/jwt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Incorrect email or password');
    }

    const token = jwtConfig.generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          name: user.name,
          email: user.email,
          _id: user._id
        }
      }
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};