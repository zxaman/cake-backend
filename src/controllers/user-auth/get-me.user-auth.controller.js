const UserAuth = require('../../models/user-auth.model');

const getMe = async (req, res) => {
    try {
        const user = await UserAuth.findById(req.user.id);

        res.status(200).json({
            success: true,
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

module.exports = { getMe };