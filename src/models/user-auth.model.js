const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userAuthSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userAuthSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('UserAuth', userAuthSchema);