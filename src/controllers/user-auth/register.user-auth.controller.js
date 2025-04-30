const UserAuth = require('../../models/user-auth.model');
const jwt = require('jsonwebtoken');
const registerValidator = require('../../validators/user-auth/register.validator');

const register = async (req, res) => {
    try {
        // Validate request body
        const { error } = registerValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { fullName, email, password } = req.body;

        // Check if user exists
        const existingUser = await UserAuth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new user
        const user = await UserAuth.create({
            fullName,
            email,
            password
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register };